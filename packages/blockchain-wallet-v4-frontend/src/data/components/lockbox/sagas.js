import { call, put, take, select, takeEvery } from 'redux-saga/effects'
import {
  head,
  contains,
  filter,
  find,
  length,
  prop,
  propEq,
  values
} from 'ramda'
import { delay, eventChannel, END } from 'redux-saga'
import { actionTypes, actions, selectors } from 'data'
import * as A from './actions'
import * as AT from './actionTypes'
import * as C from 'services/AlertService'
import * as S from './selectors'
import * as CC from 'services/ConfirmService'
import * as Lockbox from 'services/LockboxService'
import { confirm, promptForLockbox } from 'services/SagaService'

const logLocation = 'components/lockbox/sagas'

export default ({ api }) => {
  // variables for deviceType and app polling during new device setup
  let pollPosition, closePoll

  // allows for device type quick polling during new device setup
  const pollForDeviceTypeChannel = pollLength => {
    return eventChannel(emitter => {
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
    return eventChannel(emitter => {
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
  const pollForDeviceApp = function*(action) {
    try {
      let { appRequested, deviceIndex, deviceType, timeout } = action.payload

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
        const deviceR = yield select(
          selectors.core.kvStore.lockbox.getDevice,
          deviceIndex
        )
        const device = deviceR.getOrFail()
        deviceType = prop('device_type', device)
      }
      const appConnection = yield Lockbox.utils.pollForAppConnection(
        deviceType,
        appRequested,
        timeout
      )
      yield put(
        A.setConnectionInfo(
          appConnection.app,
          deviceIndex,
          deviceType,
          appConnection.transport
        )
      )
      closePoll = true
    } catch (e) {
      yield put(A.setConnectionError(e))
      yield put(actions.logs.logErrorMessage(logLocation, 'connectDevice', e))
    }
  }

  // determines if lockbox is authentic
  const checkDeviceAuthenticity = function*() {
    try {
      yield put(A.checkDeviceAuthenticityLoading())
      const { deviceType } = yield select(S.getCurrentConnection)
      // reset connection with default timeout
      yield put(A.pollForDeviceApp('DASHBOARD', null, deviceType))
      // take new transport
      yield take(AT.SET_CONNECTION_INFO)
      const { transport } = yield select(S.getCurrentConnection)
      // get base device info
      const deviceInfo = yield call(Lockbox.utils.getDeviceInfo, transport)
      // get full device info via api
      const deviceVersion = yield call(api.getDeviceVersion, {
        provider: deviceInfo.providerId,
        target_id: deviceInfo.targetId
      })
      // get full firmware info via api
      const firmware = yield call(api.getCurrentFirmware, {
        device_version: deviceVersion.id,
        version_name: deviceInfo.fullVersion,
        provider: deviceInfo.providerId
      })

      const domainsR = yield select(selectors.core.walletOptions.getDomains)
      const domains = domainsR.getOrElse({
        ledgerSocket: 'wss://api.ledgerwallet.com'
      })

      // open socket and check if device is authentic
      const isDeviceAuthentic = yield call(
        Lockbox.firmware.checkDeviceAuthenticity,
        transport,
        domains.ledgerSocket,
        {
          targetId: deviceInfo.targetId,
          perso: firmware.perso
        }
      )

      yield put(A.checkDeviceAuthenticitySuccess(isDeviceAuthentic))
    } catch (e) {
      yield put(A.changeDeviceSetupStep('error-step', true, 'authenticity'))
      yield put(A.checkDeviceAuthenticityFailure(e))
      yield put(
        actions.logs.logErrorMessage(logLocation, 'checkDeviceAuthenticity', e)
      )
    }
  }

  // determines if lockbox is setup and routes app accordingly
  const determineLockboxRoute = function*() {
    try {
      const invitationsR = yield select(selectors.core.settings.getInvitations)
      const devicesR = yield select(selectors.core.kvStore.lockbox.getDevices)

      const invitations = invitationsR.getOrElse({})
      const devices = devicesR.getOrElse([])

      // for invited users only, sorry!
      if (!prop('lockbox', invitations)) {
        yield put(actions.router.push('/home'))
        return
      }

      if (length(devices)) {
        // always go to the first device's dashboard
        const index = 0
        yield put(A.initializeDashboard(index))
        yield put(actions.router.push(`/lockbox/dashboard/${index}`))
      } else {
        yield put(actions.router.push('/lockbox/onboard'))
      }
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'determineLockboxRoute', e)
      )
    }
  }

  // saves new device to KvStore
  const saveNewDeviceKvStore = function*(action) {
    try {
      const { deviceName } = action.payload
      yield put(A.saveNewDeviceKvStoreLoading())
      const newDeviceR = yield select(S.getNewDeviceInfo)
      const newDevice = newDeviceR.getOrFail('missing_device')
      const mdAccountsEntry = Lockbox.utils.generateAccountsMDEntry(
        newDevice,
        deviceName
      )
      // store device in kvStore
      yield put(
        actions.core.kvStore.lockbox.createNewDeviceEntry(mdAccountsEntry)
      )
      yield put(A.saveNewDeviceKvStoreSuccess())
      yield put(actions.modals.closeModal())
      yield put(actions.core.data.bch.fetchData())
      yield put(actions.core.data.bitcoin.fetchData())
      yield put(actions.core.data.ethereum.fetchData())
      yield put(actions.core.data.xlm.fetchData())
      yield put(actions.alerts.displaySuccess(C.LOCKBOX_SETUP_SUCCESS))
      const devices = (yield select(
        selectors.core.kvStore.lockbox.getDevices
      )).getOrElse([])
      const index = length(devices) - 1
      yield put(A.initializeDashboard(index))
      yield put(actions.router.push(`/lockbox/dashboard/${index}`))
    } catch (e) {
      yield put(A.saveNewDeviceKvStoreFailure(e))
      yield put(actions.alerts.displayError(C.LOCKBOX_SETUP_ERROR))
      yield put(actions.logs.logErrorMessage(logLocation, 'storeDeviceName', e))
    } finally {
      // reset new device setup to step 1
      yield put(A.changeDeviceSetupStep('setup-type'))
    }
  }

  const saveCoinMD = function*(action) {
    try {
      const { deviceIndex, coin } = action.payload
      const deviceR = yield select(
        selectors.core.kvStore.lockbox.getDevice,
        deviceIndex
      )
      const deviceType = prop('device_type', deviceR.getOrFail())
      const deviceName = prop('device_name', deviceR.getOrFail())
      let entry
      switch (coin) {
        case 'xlm':
          yield call(promptForLockbox, 'XLM', deviceType, [], false)
          const { transport } = yield select(S.getCurrentConnection)
          const { publicKey } = yield call(
            Lockbox.utils.getXlmPublicKey,
            deviceType,
            transport
          )
          if (publicKey) {
            entry = Lockbox.utils.generateXlmAccountMDEntry(
              deviceName,
              publicKey
            )

            yield put(
              actions.core.kvStore.lockbox.addCoinEntry(
                deviceIndex,
                coin,
                entry
              )
            )
          }
          yield put(actions.components.lockbox.setConnectionSuccess())
          yield delay(2000)
          yield put(actions.modals.closeAllModals())
          break
        default:
          throw new Error('unknown coin type')
      }
      yield take(
        actionTypes.core.kvStore.lockbox.FETCH_METADATA_LOCKBOX_SUCCESS
      )
      yield put(A.initializeDashboard(deviceIndex))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'saveCoinMD', e))
    }
  }

  // renames a device in KvStore
  const updateDeviceName = function*(action) {
    try {
      const { deviceIndex, deviceName } = action.payload
      yield put(A.updateDeviceNameLoading())
      yield put(
        actions.core.kvStore.lockbox.storeDeviceName(deviceIndex, deviceName)
      )
      yield put(A.updateDeviceNameSuccess())
      yield put(actions.alerts.displaySuccess(C.LOCKBOX_UPDATE_SUCCESS))
    } catch (e) {
      yield put(A.updateDeviceNameFailure())
      yield put(actions.alerts.displayError(C.LOCKBOX_UPDATE_ERROR))
      yield put(
        actions.logs.logErrorMessage(logLocation, 'updateDeviceName', e)
      )
    }
  }

  // deletes a device from KvStore
  const deleteDevice = function*(action) {
    try {
      const { deviceIndex } = action.payload

      const confirmed = yield call(confirm, {
        title: CC.CONFIRM_DELETE_LOCKBOX_TITLE,
        message: CC.CONFIRM_DELETE_LOCKBOX_MESSAGE,
        nature: 'warning'
      })
      if (confirmed) {
        try {
          yield put(A.deleteDeviceLoading())
          yield put(
            actions.core.kvStore.lockbox.deleteDeviceLockbox(deviceIndex)
          )
          yield put(actions.router.push('/lockbox'))
          yield put(A.deleteDeviceSuccess())
          yield put(actions.alerts.displaySuccess(C.LOCKBOX_DELETE_SUCCESS))
          yield put(actions.core.data.bitcoin.fetchTransactions('', true))
          yield put(actions.core.data.ethereum.fetchTransactions('', true))
          yield put(actions.core.data.bch.fetchTransactions('', true))
          yield put(actions.core.data.xlm.fetchTransactions('', true))
        } catch (e) {
          yield put(A.deleteDeviceFailure(e))
          yield put(actions.alerts.displayError(C.LOCKBOX_DELETE_ERROR))
          yield put(
            actions.logs.logErrorMessage(logLocation, 'deleteDevice', e)
          )
        }
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'deleteDevice', e))
    }
  }

  // fetches info on the latest applications for device
  const deriveLatestAppInfo = function*() {
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
        version_name: deviceInfo.fullVersion,
        provider: deviceInfo.providerId
      })
      // get latest info on applications
      const appInfos = yield call(api.getApplications, {
        provider: deviceInfo.providerId,
        current_se_firmware_final_version: seFirmwareVersion.id,
        device_version: deviceVersion.id
      })
      // limit apps to only the ones we support
      const appList = filter(
        item => contains(item.name, values(Lockbox.constants.supportedApps)),
        appInfos.application_versions
      )
      yield put(A.setLatestAppInfosSuccess(appList))
    } catch (e) {
      yield put(A.setLatestAppInfosFailure())
      yield put(
        actions.logs.logErrorMessage(logLocation, 'deriveLatestAppInfo', e)
      )
    }
  }

  // new device setup saga
  const initializeNewDeviceSetup = function*() {
    try {
      closePoll = false
      let pollLength = 2500
      pollPosition = 0
      yield put(A.changeDeviceSetupStep('connect-device'))
      // poll for device type via channel
      const deviceTypeChannel = yield call(pollForDeviceTypeChannel, pollLength)
      yield takeEvery(deviceTypeChannel, function*(deviceType) {
        yield put(A.pollForDeviceApp('DASHBOARD', null, deviceType, pollLength))
      })
      // device connection made
      const { payload } = yield take(AT.SET_CONNECTION_INFO)
      const { deviceType } = payload
      yield take(AT.SET_NEW_DEVICE_SETUP_STEP)
      // prefetch app infos for future step
      yield call(deriveLatestAppInfo)
      // check device authenticity
      yield put(A.checkDeviceAuthenticity())
      yield take(AT.SET_NEW_DEVICE_SETUP_STEP)
      const setupType = yield select(S.getNewDeviceSetupType)
      if (setupType === 'new') {
        // installing btc app, wait for confirmation of install
        yield take(AT.NEW_DEVICE_BTC_INSTALL)
        yield put(A.installApplication('BTC'))
        yield take(AT.SET_NEW_DEVICE_SETUP_STEP)
      }
      // quick poll for BTC connection in case user cancels setup to install BTC
      pollLength = 5000
      closePoll = false
      const btcAppChannel = yield call(
        pollForDeviceAppChannel,
        'BTC',
        pollLength
      )
      yield takeEvery(btcAppChannel, function*(app) {
        yield put(A.pollForDeviceApp(app, null, deviceType, pollLength))
      })
      // BTC app connection
      yield take(AT.SET_CONNECTION_INFO)
      const connection = yield select(S.getCurrentConnection)
      // create BTC transport
      const btcConnection = Lockbox.utils.createBtcBchConnection(
        connection.app,
        connection.deviceType,
        connection.transport
      )
      // derive device info (chaincodes and xpubs)
      const newDeviceInfo = yield call(
        Lockbox.utils.deriveDeviceInfo,
        btcConnection
      )
      yield put(
        A.setNewDeviceInfo({
          info: newDeviceInfo,
          type: deviceType
        })
      )
      const storedDevicesBtcContextR = yield select(
        selectors.core.kvStore.lockbox.getLockboxBtcContext
      )
      const storedDevicesBtcContext = storedDevicesBtcContextR.getOrElse([])
      const newDeviceBtcContext = prop('btc', newDeviceInfo)
      // check if device has already been added
      if (contains(newDeviceBtcContext, storedDevicesBtcContext)) {
        yield put(A.changeDeviceSetupStep('error-step', true, 'duplicate'))
      } else {
        yield put(A.changeDeviceSetupStep('open-btc-app', true))
      }
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'initializeNewDeviceSetup', e)
      )
    }
  }

  // loads data for device dashboard
  const initializeDashboard = function*(action) {
    yield call(updateTransactionList, action)
  }

  // updates latest transaction information for device
  const updateTransactionList = function*(action) {
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
      (yield select(
        selectors.core.kvStore.lockbox.getXlmContextForDevice,
        deviceIndex
      )).getOrElse(null)
    )

    yield put(actions.core.data.bitcoin.fetchTransactions(btcContext, reset))
    yield put(actions.core.data.ethereum.fetchTransactions(ethContext, reset))
    yield put(actions.core.data.bch.fetchTransactions(bchContext, reset))
    // xlmContext can be empty if not saved to MD yet
    // if empty set transaction list to empty array to avoid mixing tx lists
    if (xlmContext) {
      yield put(actions.core.data.xlm.fetchTransactions(xlmContext, reset))
    } else {
      yield put(actions.core.data.xlm.fetchTransactionsSuccess([], true))
    }
  }

  // update device firmware saga
  const updateDeviceFirmware = function*(action) {
    try {
      const { deviceIndex } = action.payload
      // reset previous firmware infos
      yield put(A.resetFirmwareInfo())
      yield put(A.changeFirmwareUpdateStep({ step: 'connect-device' }))
      // derive device type
      const deviceR = yield select(
        selectors.core.kvStore.lockbox.getDevice,
        deviceIndex
      )
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
        version_name: deviceInfo.fullVersion,
        provider: deviceInfo.providerId
      })
      // get next possible firmware info
      const latestFirmware = yield call(api.getLatestFirmware, {
        current_se_firmware_final_version: seFirmwareVersion.id,
        device_version: deviceVersion.id,
        provider: deviceInfo.providerId
      })

      if (latestFirmware.result !== 'null') {
        // device firmware is out of date
        const seFirmwareOsuVersion = prop(
          'se_firmware_osu_version',
          latestFirmware
        )
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
            step: 'check-versions',
            status: Lockbox.utils.formatFirmwareDisplayName(osuFirmware.name)
          })
        )
        // wait for user to continue
        yield take(AT.SET_FIRMWARE_UPDATE_STEP)
        yield put(
          A.changeFirmwareUpdateStep({
            step: 'uninstall-apps',
            status: Lockbox.utils.formatFirmwareHash(osuFirmware.hash)
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
            step: 'install-firmware',
            status: ''
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
            step: 'install-complete',
            status: 'success'
          })
        )
      } else {
        // no firmware to install
        yield put(
          A.changeFirmwareUpdateStep({
            step: 'install-complete',
            status: 'uptodate'
          })
        )
      }
    } catch (e) {
      // TODO: reject errors are getting swallowed in promise
      yield put(
        A.changeFirmwareUpdateStep({
          step: 'install-complete',
          status: 'error'
        })
      )
      yield put(
        actions.logs.logErrorMessage(logLocation, 'updateDeviceFirmware', e)
      )
    }
  }

  // initializes the app manager to add and remove apps
  const initializeAppManager = function*(action) {
    const { deviceIndex } = action.payload

    try {
      if (deviceIndex) {
        // derive device type
        const deviceR = yield select(
          selectors.core.kvStore.lockbox.getDevice,
          deviceIndex
        )
        const deviceType = prop('device_type', deviceR.getOrFail())
        // poll for device connection on dashboard
        yield put(A.pollForDeviceApp('DASHBOARD', null, deviceType))
      } else {
        // no device index passed, user may be in device setup. quick poll for device type
        closePoll = false
        let pollLength = 2500
        pollPosition = 0
        // poll for device type via channel
        const deviceTypeChannel = yield call(
          pollForDeviceTypeChannel,
          pollLength
        )
        yield takeEvery(deviceTypeChannel, function*(deviceType) {
          yield put(
            A.pollForDeviceApp('DASHBOARD', null, deviceType, pollLength)
          )
        })
      }
      // device connection made
      yield take(AT.SET_CONNECTION_INFO)
      yield call(deriveLatestAppInfo)
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'initializeAppManager', e)
      )
    }
  }

  // installs requested application on device
  const installApplication = function*(action) {
    const { appName } = action.payload
    try {
      yield put(A.appChangeLoading())
      const { transport } = yield select(S.getCurrentConnection)
      const targetId = (yield select(S.getDeviceTargetId)).getOrFail()
      const latestAppVersions = (yield select(
        S.getLatestApplicationVersions
      )).getOrFail(6)
      const domains = (yield select(
        selectors.core.walletOptions.getDomains
      )).getOrElse({
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
      yield put(
        actions.logs.logErrorMessage(logLocation, 'installApplication', e)
      )
    }
  }

  // uninstalls requested application on device
  const uninstallApplication = function*(action) {
    const { appName } = action.payload
    try {
      yield put(A.appChangeLoading())
      const { transport } = yield select(S.getCurrentConnection)
      const targetId = (yield select(S.getDeviceTargetId)).getOrFail()
      const latestAppVersions = (yield select(
        S.getLatestApplicationVersions
      )).getOrFail()
      const domains = (yield select(
        selectors.core.walletOptions.getDomains
      )).getOrElse({
        ledgerSocket: 'wss://api.ledgerwallet.com'
      })
      const appInfo = find(propEq('name', appName), latestAppVersions)
      // uninstall application
      yield call(
        Lockbox.apps.uninstallApp,
        transport,
        domains.ledgerSocket,
        targetId,
        appInfo
      )
      yield put(A.appChangeSuccess(appName, 'uninstall'))
    } catch (e) {
      yield put(A.appChangeFailure(appName, 'uninstall', e))
      yield put(
        actions.logs.logErrorMessage(logLocation, 'uninstallApplication', e)
      )
    }
  }

  return {
    checkDeviceAuthenticity,
    deleteDevice,
    deriveLatestAppInfo,
    determineLockboxRoute,
    initializeDashboard,
    initializeAppManager,
    initializeNewDeviceSetup,
    installApplication,
    pollForDeviceApp,
    pollForDeviceAppChannel,
    pollForDeviceTypeChannel,
    saveNewDeviceKvStore,
    saveCoinMD,
    uninstallApplication,
    updateDeviceFirmware,
    updateDeviceName,
    updateTransactionList
  }
}
