import { filter, find, head, includes, length, prop, propEq, values } from 'ramda'
import { END, eventChannel } from 'redux-saga'
import { call, cancelled, delay, put, select, take, takeEvery } from 'redux-saga/effects'

import { actions, actionTypes, selectors } from 'data'
import * as C from 'services/alerts'
import * as Lockbox from 'services/lockbox'
import { confirm } from 'services/sagas'

import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'

const logLocation = 'components/lockbox/sagas'
const sagaCancelledMsg = 'Saga cancelled from user modal close'

export default ({ api }) => {
  // variables for deviceType and app polling during new device setup
  let pollPosition
  let closePoll

  // allows for device type quick polling during new device setup
  const pollForDeviceTypeChannel = (pollLength) => {
    return eventChannel((emitter) => {
      const devicePollInterval = setInterval(() => {
        if (closePoll) {
          emitter(END)
          return
        }
        // swap deviceType polling between intervals
        pollPosition += pollLength
        const index = pollPosition / pollLength
        emitter(index % 2 === 0 ? 'ledger' : 'blockchain')
      }, pollLength)
      return () => clearInterval(devicePollInterval)
    })
  }

  // allows for application quick polling during new device setup
  const pollForDeviceAppChannel = (app, pollLength) => {
    return eventChannel((emitter) => {
      const appPollInterval = setInterval(() => {
        if (closePoll) {
          emitter(END)
          return
        }
        emitter(app)
      }, pollLength)
      return () => clearInterval(appPollInterval)
    })
  }

  /**
   * Polls for device application to be opened
   * @param {String} action.app - Requested application to wait for
   * @param {String} [action.deviceIndex] - Optional kvStore device index
   * @param {String} [action.deviceType] - Optional device type (ledger or blockchain)
   * @param {Number} [action.timeout] - Optional length of time in ms to wait for a connection
   * @returns {Action} Yields device connected action
   */
  const pollForDeviceApp = function* (action) {
    try {
      let { deviceType } = action.payload
      const { appRequested, deviceIndex, timeout } = action.payload

      // close previous transport and reset old connection info
      try {
        const previousConnection = yield select(S.getCurrentConnection)
        if (!deviceIndex && !deviceType) {
          deviceType = previousConnection.deviceType
        }
        if (previousConnection.transport) {
          previousConnection.transport.close()
        }
      } finally {
        yield put(A.resetConnectionStatus())
      }
      if (!deviceType) {
        const deviceR = yield select(selectors.core.kvStore.lockbox.getDevice, deviceIndex)
        const device = deviceR.getOrFail()
        deviceType = prop('device_type', device)
      }
      const appConnection = yield Lockbox.utils.pollForAppConnection(
        deviceType,
        appRequested,
        timeout
      )
      yield put(
        A.setConnectionInfo(appConnection.app, deviceIndex, deviceType, appConnection.transport)
      )
      closePoll = true
    } catch (e) {
      yield put(A.setConnectionError(e))
      yield put(actions.logs.logErrorMessage(logLocation, 'pollForDeviceApp', e))
    } finally {
      if (yield cancelled()) {
        actions.logs.logInfoMessage(logLocation, 'pollForDeviceApp', sagaCancelledMsg)
      }
    }
  }

  // determines if lockbox is setup and routes app accordingly
  const determineLockboxRoute = function* () {
    try {
      const devicesR = yield select(selectors.core.kvStore.lockbox.getDevices)
      const devices = devicesR.getOrElse([])

      if (length(devices)) {
        // always go to the first device's dashboard
        const index = 0
        yield put(A.initializeDashboard(index))
        yield put(actions.router.push(`/lockbox/dashboard/${index}`))
      } else {
        yield put(actions.router.push('/lockbox/onboard'))
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'determineLockboxRoute', e))
    }
  }

  // saves new device to KvStore
  const saveNewDeviceKvStore = function* () {
    let deviceDisplayName
    try {
      yield put(A.saveNewDeviceKvStoreLoading())
      let newDeviceName = 'My '
      const newDevice = (yield select(S.getNewDeviceInfo)).getOrFail()
      deviceDisplayName = newDevice.type === 'ledger' ? 'Nano S' : 'Lockbox'
      newDeviceName += deviceDisplayName
      const deviceList = (yield select(selectors.core.kvStore.lockbox.getDevices)).getOrElse([])
      const deviceCount = length(deviceList.map((d) => d.device_name))
      if (deviceCount > 0) {
        newDeviceName += ` ${deviceCount + 1}`
      }
      const mdAccountsEntry = Lockbox.utils.generateAccountsMDEntry(newDevice, newDeviceName)
      // store device in kvStore
      yield put(actions.core.kvStore.lockbox.createNewDeviceEntry(mdAccountsEntry))
      yield put(A.saveNewDeviceKvStoreSuccess())
      yield put(actions.core.data.bch.fetchData())
      yield put(actions.core.data.btc.fetchData())
      yield put(actions.core.data.eth.fetchData())
      yield put(actions.core.data.xlm.fetchData())
      yield put(
        actions.alerts.displaySuccess(C.LOCKBOX_SETUP_SUCCESS, {
          deviceType: deviceDisplayName
        })
      )
    } catch (e) {
      yield put(
        actions.alerts.displayError(C.LOCKBOX_SETUP_ERROR, {
          deviceType: deviceDisplayName
        })
      )
      yield put(A.saveNewDeviceKvStoreFailure(e))
      yield put(actions.logs.logErrorMessage(logLocation, 'saveNewDeviceKvStore', e))
    }
  }

  // saves xPubs/addresses for requested coin to kvStore
  const saveCoinMD = function* (action) {
    try {
      const { coin, deviceIndex } = action.payload
      const deviceR = yield select(selectors.core.kvStore.lockbox.getDevice, deviceIndex)
      const deviceType = prop('device_type', deviceR.getOrFail())
      const deviceName = prop('device_name', deviceR.getOrFail())
      let entry
      switch (coin) {
        case 'xlm':
          yield call(Lockbox.promptForLockbox, 'XLM', deviceType, [], false)
          const { transport } = yield select(S.getCurrentConnection)
          const { publicKey } = yield call(Lockbox.utils.getXlmPublicKey, deviceType, transport)
          if (!publicKey) throw new Error('No XLM public key found')
          entry = Lockbox.utils.generateXlmAccountMDEntry(deviceName, publicKey)
          yield put(actions.components.lockbox.setConnectionSuccess())
          yield delay(2000)
          yield put(actions.modals.closeAllModals())
          break
        default:
          throw new Error('unknown coin type')
      }
      yield put(actions.core.kvStore.lockbox.addCoinEntry(deviceIndex, coin, entry))
      yield take(actionTypes.core.kvStore.lockbox.FETCH_METADATA_LOCKBOX_SUCCESS)
      yield put(A.initializeDashboard(deviceIndex))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'saveCoinMD', e))
    }
  }

  // renames a device in KvStore
  const updateDeviceName = function* (action) {
    try {
      const { deviceIndex, deviceName } = action.payload
      yield put(A.updateDeviceNameLoading())
      yield put(actions.core.kvStore.lockbox.updateDeviceName(deviceIndex, deviceName))
      yield put(A.updateDeviceNameSuccess())
      yield put(actions.alerts.displaySuccess(C.LOCKBOX_UPDATE_SUCCESS))
    } catch (e) {
      yield put(A.updateDeviceNameFailure())
      yield put(actions.alerts.displayError(C.LOCKBOX_UPDATE_ERROR))
      yield put(actions.logs.logErrorMessage(logLocation, 'updateDeviceName', e))
    }
  }

  // deletes a device from KvStore
  const deleteDevice = function* (action) {
    try {
      const { deviceIndex } = action.payload

      const confirmed = yield call(confirm, {
        message: C.CONFIRM_DELETE_LOCKBOX_MESSAGE,
        nature: 'warning',
        title: C.CONFIRM_DELETE_LOCKBOX_TITLE
      })
      if (confirmed) {
        try {
          yield put(A.deleteDeviceLoading())
          yield put(actions.core.kvStore.lockbox.deleteDeviceLockbox(deviceIndex))
          yield call(determineLockboxRoute)
          yield put(A.deleteDeviceSuccess())
          yield put(actions.alerts.displaySuccess(C.LOCKBOX_DELETE_SUCCESS))
          yield put(actions.core.data.btc.fetchTransactions('', true))
          yield put(actions.core.data.eth.fetchTransactions('', true))
          yield put(actions.core.data.bch.fetchTransactions('', true))
          yield put(actions.core.data.xlm.fetchTransactions('', true))
        } catch (e) {
          yield put(A.deleteDeviceFailure(e))
          yield put(actions.alerts.displayError(C.LOCKBOX_DELETE_ERROR))
          yield put(actions.logs.logErrorMessage(logLocation, 'deleteDevice', e))
        }
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'deleteDevice', e))
    }
  }

  // fetches info on the latest applications for device
  const deriveLatestAppInfo = function* () {
    try {
      yield put(A.setLatestAppInfosLoading())
      const { transport } = yield select(S.getCurrentConnection)
      // get base device info
      const deviceInfo = yield call(Lockbox.utils.getDeviceInfo, transport)
      yield put(A.setDeviceTargetId(deviceInfo.targetId))
      // get full device info via api
      const deviceVersion = yield call(api.getDeviceVersion, {
        provider: deviceInfo.providerId,
        target_id: deviceInfo.targetId
      })
      // get full firmware info via api
      const seFirmwareVersion = yield call(api.getCurrentFirmware, {
        device_version: deviceVersion.id,
        provider: deviceInfo.providerId,
        version_name: deviceInfo.fullVersion
      })
      // get latest info on applications
      const appInfos = yield call(api.getApplications, {
        current_se_firmware_final_version: seFirmwareVersion.id,
        device_version: deviceVersion.id,
        provider: deviceInfo.providerId
      })
      // limit apps to only the ones we support
      const appList = filter(
        (item) => includes(item.name, values(Lockbox.constants.supportedApps)),
        appInfos.application_versions
      )
      yield put(A.setLatestAppInfosSuccess(appList))
    } catch (e) {
      yield put(A.setLatestAppInfosFailure())
      yield put(actions.logs.logErrorMessage(logLocation, 'deriveLatestAppInfo', e))
    }
  }

  // device connection polling for device setup
  const initializeNewDeviceSetup = function* () {
    try {
      closePoll = false
      const pollLength = 2000
      pollPosition = 0
      // poll for device type via channel
      const deviceTypeChannel = yield call(pollForDeviceTypeChannel, pollLength)
      // eslint-disable-next-line func-names
      yield takeEvery(deviceTypeChannel, function* (deviceType) {
        yield put(A.pollForDeviceApp('DASHBOARD', null, deviceType, pollLength))
      })
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'initializeNewDeviceSetup', e))
    } finally {
      if (yield cancelled()) {
        yield put(A.resetConnectionStatus())
        actions.logs.logInfoMessage(logLocation, 'initializeNewDeviceSetup', sagaCancelledMsg)
      }
    }
  }

  // finalize new device setup
  // eslint-disable-next-line consistent-return
  const finalizeNewDeviceSetup = function* () {
    let connection
    try {
      // safeguard in case existing polling is still running
      closePoll = true
      yield delay(2000)
      // setup for deviceType and btc app polling
      closePoll = false
      const pollLength = 2000
      pollPosition = 0
      // poll for device type via channel
      const deviceTypeChannel = yield call(pollForDeviceTypeChannel, pollLength)
      yield takeEvery(deviceTypeChannel, function* (deviceType) {
        yield put(A.pollForDeviceApp('BTC', null, deviceType, pollLength))
      })
      // BTC app connection
      yield take(AT.SET_CONNECTION_INFO)
      connection = yield select(S.getCurrentConnection)
      // create BTC transport
      const btcConnection = Lockbox.utils.createBtcBchConnection(
        connection.app,
        connection.deviceType,
        connection.transport
      )
      // get BTC app version
      const btcAppVersion = yield call(Lockbox.apps.getBtcAppVersion, connection.transport)
      if (btcAppVersion.minor > 2) {
        // increase timeout since BTC app version > 1.3 and user must manually
        // allow the export of pub keys on device
        connection.transport.exchangeTimeout = 45000
        yield put(A.setNewDeviceShowBtcWarning(true))
      }
      // derive device info (chaincodes and xpubs)
      const newDeviceInfo = yield call(Lockbox.utils.deriveDeviceInfo, btcConnection)
      yield put(
        A.setNewDeviceInfo({
          info: newDeviceInfo,
          type: connection.deviceType
        })
      )
      const storedDevicesBtcContext = (yield select(
        selectors.core.kvStore.lockbox.getLockboxBtcContext
      )).getOrElse([])
      const newDeviceBtcContext = prop('btc', newDeviceInfo)
      // check if device has already been added
      if (includes(newDeviceBtcContext, storedDevicesBtcContext)) {
        return yield put(A.changeDeviceSetupStep('error-step', true, 'duplicate'))
      }
      yield put(A.changeDeviceSetupStep('finish-step'))
      yield put(actions.preferences.hideLockboxSoftwareDownload())
    } catch (e) {
      yield put(
        actions.alerts.displayError(C.LOCKBOX_SETUP_ERROR, {
          deviceType: connection.deviceType === 'ledger' ? 'Nano S' : 'Lockbox'
        })
      )
      yield put(actions.logs.logErrorMessage(logLocation, 'finalizeNewDeviceSetup', e))
    } finally {
      if (yield cancelled()) {
        actions.logs.logInfoMessage(logLocation, 'finalizeNewDeviceSetup', sagaCancelledMsg)
      }
    }
  }

  // routes new device to dashboard
  const routeNewDeviceToDashboard = function* (action) {
    try {
      const { startTour } = action.payload
      const devices = (yield select(selectors.core.kvStore.lockbox.getDevices)).getOrElse([])
      const index = length(devices) - 1
      yield put(A.initializeDashboard(index))
      yield put(A.setProductTourVisibility(startTour))
      yield put(actions.router.push(`/lockbox/dashboard/${index}`))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'routeNewDeviceToDashboard', e))
    }
  }

  // updates latest transaction information for device
  const updateTransactionList = function* (action) {
    const { deviceIndex, reset } = action.payload
    const btcContext = (yield select(
      selectors.core.kvStore.lockbox.getBtcContextForDevice,
      deviceIndex
    )).getOrElse(null)
    const bchContext = (yield select(
      selectors.core.kvStore.lockbox.getBchContextForDevice,
      deviceIndex
    )).getOrElse(null)
    const ethContext = (yield select(
      selectors.core.kvStore.lockbox.getEthContextForDevice,
      deviceIndex
    )).getOrElse(null)
    const xlmContext = head(
      (yield select(selectors.core.kvStore.lockbox.getXlmContextForDevice, deviceIndex)).getOrElse(
        null
      )
    )

    yield put(actions.core.data.btc.fetchTransactions(btcContext, reset))
    yield put(actions.core.data.eth.fetchTransactions(ethContext, reset))
    yield put(actions.core.data.bch.fetchTransactions(bchContext, reset))
    // xlmContext can be empty if not saved to MD yet
    // if empty set transaction list to empty array to avoid mixing tx lists
    if (xlmContext) {
      yield put(actions.core.data.xlm.fetchTransactions(xlmContext, reset))
    } else {
      yield put(actions.core.data.xlm.fetchTransactionsSuccess([], true))
    }
  }

  // loads data for device dashboard
  const initializeDashboard = function* (action) {
    yield call(updateTransactionList, action)
  }

  // update device firmware saga
  const updateDeviceFirmware = function* (action) {
    try {
      const { deviceIndex } = action.payload
      // reset previous firmware infos
      yield put(A.resetFirmwareInfo())
      yield put(A.changeFirmwareUpdateStep({ step: 'connect-device' }))
      // derive device type
      const deviceR = yield select(selectors.core.kvStore.lockbox.getDevice, deviceIndex)
      const device = deviceR.getOrFail()
      // poll for device connection
      yield put(A.pollForDeviceApp('DASHBOARD', null, device.device_type))
      yield take(AT.SET_CONNECTION_INFO)
      // set step to check-versions
      yield put(A.changeFirmwareUpdateStep({ step: 'check-versions' }))
      const { transport } = yield select(S.getCurrentConnection)
      // get base device info
      const deviceInfo = yield call(Lockbox.utils.getDeviceInfo, transport)
      // get full device info via api
      const deviceVersion = yield call(api.getDeviceVersion, {
        provider: deviceInfo.providerId,
        target_id: deviceInfo.targetId
      })
      // get full firmware info via api
      const seFirmwareVersion = yield call(api.getCurrentFirmware, {
        device_version: deviceVersion.id,
        provider: deviceInfo.providerId,
        version_name: deviceInfo.fullVersion
      })
      // get next possible firmware info
      const latestFirmware = yield call(api.getLatestFirmware, {
        current_se_firmware_final_version: seFirmwareVersion.id,
        device_version: deviceVersion.id,
        provider: deviceInfo.providerId
      })

      if (latestFirmware.result !== 'null') {
        // device firmware is out of date
        const seFirmwareOsuVersion = prop('se_firmware_osu_version', latestFirmware)
        const nextSeFirmwareFinalVersion = prop(
          'next_se_firmware_final_version',
          seFirmwareOsuVersion
        )
        // fetch final firmware info
        const seFirmwareFinalVersion = yield call(
          api.getFinalFirmwareById,
          nextSeFirmwareFinalVersion
        )
        const osuFirmware = {
          ...seFirmwareOsuVersion,
          shouldFlashMcu: false
        }
        yield put(
          A.changeFirmwareUpdateStep({
            status: Lockbox.utils.formatFirmwareDisplayName(osuFirmware.name),
            step: 'check-versions'
          })
        )
        // wait for user to continue
        yield take(AT.SET_FIRMWARE_UPDATE_STEP)
        yield put(
          A.changeFirmwareUpdateStep({
            status: Lockbox.utils.formatFirmwareHash(osuFirmware.hash),
            step: 'uninstall-apps'
          })
        )
        // uninstall apps to ensure room for firmware
        // TODO: this is gross and wont work once all apps dont fit onto device
        // should just show user not enough space error and have them remove
        // desired apps themselves
        yield put(A.uninstallApplication('BCH'))
        yield take([AT.APP_CHANGE_FAILURE, AT.APP_CHANGE_SUCCESS])
        yield put(A.uninstallApplication('ETH'))
        yield take([AT.APP_CHANGE_FAILURE, AT.APP_CHANGE_SUCCESS])
        yield put(A.uninstallApplication('XLM'))
        yield take([AT.APP_CHANGE_FAILURE, AT.APP_CHANGE_SUCCESS])
        yield put(A.uninstallApplication('BTC'))
        yield take([AT.APP_CHANGE_FAILURE, AT.APP_CHANGE_SUCCESS])
        // fetch base socket domain
        const domainsR = yield select(selectors.core.walletOptions.getDomains)
        const domains = domainsR.getOrElse({
          ledgerSocket: 'wss://api.ledgerwallet.com'
        })
        yield put(A.pollForDeviceApp('DASHBOARD', null, device.device_type))
        yield take(AT.SET_CONNECTION_INFO)
        const connection = yield select(S.getCurrentConnection)
        // install osu firmware
        yield call(
          Lockbox.firmware.installOsuFirmware,
          connection.transport,
          domains.ledgerSocket,
          osuFirmware,
          deviceInfo.targetId
        )
        yield put(
          A.changeFirmwareUpdateStep({
            status: '',
            step: 'install-firmware'
          })
        )
        // wait for device to fully restart
        yield delay(2000)
        // install final firmware
        yield call(
          Lockbox.firmware.installFinalFirmware,
          connection.transport,
          domains.ledgerSocket,
          seFirmwareFinalVersion,
          deviceInfo.targetId
        )
        yield put(
          A.changeFirmwareUpdateStep({
            status: 'success',
            step: 'install-complete'
          })
        )
      } else {
        // no firmware to install
        yield put(
          A.changeFirmwareUpdateStep({
            status: 'uptodate',
            step: 'install-complete'
          })
        )
      }
    } catch (e) {
      // TODO: reject errors are getting swallowed in promise
      yield put(
        A.changeFirmwareUpdateStep({
          status: 'error',
          step: 'install-complete'
        })
      )
      yield put(actions.logs.logErrorMessage(logLocation, 'updateDeviceFirmware', e))
    } finally {
      if (yield cancelled()) {
        actions.logs.logInfoMessage(logLocation, 'updateDeviceFirmware', sagaCancelledMsg)
      }
    }
  }

  // initializes the app manager to add and remove apps
  const initializeAppManager = function* (action) {
    try {
      const { deviceIndex } = action.payload
      if (deviceIndex) {
        // accessed from dashboard
        const deviceR = yield select(selectors.core.kvStore.lockbox.getDevice, deviceIndex)
        const deviceType = prop('device_type', deviceR.getOrFail())
        // poll for device connection on dashboard
        yield put(A.pollForDeviceApp('DASHBOARD', null, deviceType))
      } else {
        // accessed from new device setup flow
        // safeguard in case existing polling is still running from previous setup step
        closePoll = true
        yield delay(2000)
        closePoll = false
        const pollLength = 2000
        pollPosition = 0
        // poll for device type and then dashboard via channel
        const deviceTypeChannel = yield call(pollForDeviceTypeChannel, pollLength)
        yield takeEvery(deviceTypeChannel, function* (deviceType) {
          yield put(A.pollForDeviceApp('DASHBOARD', null, deviceType, pollLength))
        })
        // device connection made
        yield take(AT.SET_CONNECTION_INFO)
        yield call(deriveLatestAppInfo)
      }
      // device connection made
      yield take(AT.SET_CONNECTION_INFO)
      yield call(deriveLatestAppInfo)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'initializeAppManager', e))
    }
  }

  // installs requested application on device
  const installApplication = function* (action) {
    const { appName } = action.payload
    try {
      yield put(A.appChangeLoading())
      const { transport } = yield select(S.getCurrentConnection)
      const targetId = (yield select(S.getDeviceTargetId)).getOrFail()
      const latestAppVersions = (yield select(S.getLatestApplicationVersions)).getOrFail(6)
      const domains = (yield select(selectors.core.walletOptions.getDomains)).getOrElse({
        ledgerSocket: 'wss://api.ledgerwallet.com'
      })
      // install application
      yield call(
        Lockbox.apps.installApp,
        transport,
        domains.ledgerSocket,
        targetId,
        appName,
        latestAppVersions
      )
      yield put(A.appChangeSuccess(appName, 'install'))
    } catch (e) {
      yield put(A.appChangeFailure(appName, 'install', e))
      yield put(actions.logs.logErrorMessage(logLocation, 'installApplication', e))
    }
  }

  // uninstalls requested application on device
  const uninstallApplication = function* (action) {
    const { appName } = action.payload
    try {
      yield put(A.appChangeLoading())
      const { transport } = yield select(S.getCurrentConnection)
      const targetId = (yield select(S.getDeviceTargetId)).getOrFail()
      const latestAppVersions = (yield select(S.getLatestApplicationVersions)).getOrFail()
      const domains = (yield select(selectors.core.walletOptions.getDomains)).getOrElse({
        ledgerSocket: 'wss://api.ledgerwallet.com'
      })
      const appInfo = find(propEq('name', appName), latestAppVersions)
      // uninstall application
      yield call(Lockbox.apps.uninstallApp, transport, domains.ledgerSocket, targetId, appInfo)
      yield put(A.appChangeSuccess(appName, 'uninstall'))
    } catch (e) {
      yield put(A.appChangeFailure(appName, 'uninstall', e))
      yield put(actions.logs.logErrorMessage(logLocation, 'uninstallApplication', e))
    }
  }

  return {
    deleteDevice,
    deriveLatestAppInfo,
    determineLockboxRoute,
    finalizeNewDeviceSetup,
    initializeAppManager,
    initializeDashboard,
    initializeNewDeviceSetup,
    installApplication,
    pollForDeviceApp,
    pollForDeviceAppChannel,
    pollForDeviceTypeChannel,
    routeNewDeviceToDashboard,
    saveCoinMD,
    saveNewDeviceKvStore,
    uninstallApplication,
    updateDeviceFirmware,
    updateDeviceName,
    updateTransactionList
  }
}
