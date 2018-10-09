import { call, put, take, select, takeEvery } from 'redux-saga/effects'
import { contains, find, length, prop, propEq } from 'ramda'
import { delay, eventChannel, END } from 'redux-saga'
import { actions, selectors } from 'data'
import * as A from './actions'
import * as AT from './actionTypes'
import * as C from 'services/AlertService'
import * as S from './selectors'
import * as CC from 'services/ConfirmService'
import * as Lockbox from 'services/LockboxService'
import { confirm } from 'services/SagaService'

const logLocation = 'components/lockbox/sagas'

export default ({ api }) => {
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
      if (!deviceIndex && !deviceType) {
        throw new Error('deviceIndex or deviceType is required')
      }
      // close previous transport and reset old connection info
      try {
        const { transport } = yield select(S.getCurrentConnection)
        if (transport) transport.close()
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

  // poll device channel
  const setupTimeout = 2500
  let pollPosition = 0
  let closePoll
  const pollForDeviceChannel = () =>
    eventChannel(emitter => {
      const pollInterval = setInterval(() => {
        if (closePoll) {
          emitter(END)
          return
        }
        // swap deviceType polling between intervals
        pollPosition += setupTimeout
        const index = pollPosition / setupTimeout
        emitter(index % 2 === 0 ? 'ledger' : 'blockchain')
      }, setupTimeout)
      return () => clearInterval(pollInterval)
    })

  // new device setup saga
  const initializeNewDeviceSetup = function*() {
    try {
      closePoll = false
      yield put(A.changeDeviceSetupStep('connect-device'))

      const channel = yield call(pollForDeviceChannel)
      yield takeEvery(channel, function*(deviceType) {
        yield put(
          A.pollForDeviceApp('DASHBOARD', null, deviceType, setupTimeout)
        )
      })

      const { payload } = yield take(AT.SET_CONNECTION_INFO)
      const { deviceType } = payload
      closePoll = true

      yield take(AT.SET_NEW_DEVICE_SETUP_STEP)
      // check device authenticity
      yield put(A.checkDeviceAuthenticity())
      yield take(AT.SET_NEW_DEVICE_SETUP_STEP)
      // wait for BTC connection
      yield put(A.pollForDeviceApp('BTC', null, deviceType))
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
      // TODO: better error handling, display error, close modal
      yield put(
        actions.logs.logErrorMessage(logLocation, 'initializeNewDeviceSetup', e)
      )
    }
  }

  // loads data for device dashboard
  const initializeDashboard = function*(action) {
    const { deviceIndex } = action.payload
    const btcContextR = yield select(
      selectors.core.kvStore.lockbox.getBtcContextForDevice,
      deviceIndex
    )
    const bchContextR = yield select(
      selectors.core.kvStore.lockbox.getBchContextForDevice,
      deviceIndex
    )
    const ethContextR = yield select(
      selectors.core.kvStore.lockbox.getEthContextForDevice,
      deviceIndex
    )
    yield put(
      actions.core.data.bitcoin.fetchTransactions(
        btcContextR.getOrElse(null),
        true
      )
    )
    yield put(
      actions.core.data.ethereum.fetchTransactions(
        ethContextR.getOrElse(null),
        true
      )
    )
    yield put(
      actions.core.data.bch.fetchTransactions(bchContextR.getOrElse(null), true)
    )
  }

  // updates latest transaction information for device
  const updateTransactionList = function*(action) {
    const { deviceIndex } = action.payload
    const btcContextR = yield select(
      selectors.core.kvStore.lockbox.getBtcContextForDevice,
      deviceIndex
    )
    const bchContextR = yield select(
      selectors.core.kvStore.lockbox.getBchContextForDevice,
      deviceIndex
    )
    const ethContextR = yield select(
      selectors.core.kvStore.lockbox.getEthContextForDevice,
      deviceIndex
    )
    yield put(
      actions.core.data.bitcoin.fetchTransactions(
        btcContextR.getOrElse(null),
        false
      )
    )
    yield put(
      actions.core.data.ethereum.fetchTransactions(
        ethContextR.getOrElse(null),
        false
      )
    )
    yield put(
      actions.core.data.bch.fetchTransactions(
        bchContextR.getOrElse(null),
        false
      )
    )
  }

  // update device firmware saga
  /* eslint-disable */
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
      // wait for user to continue
      yield take(AT.SET_FIRMWARE_UPDATE_STEP)
      let { transport } = yield select(S.getCurrentConnection)
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
      // latestFirmware.display_name = "1.4.2-bc3-osu"
      // latestFirmware.firmware = "nanos/1.4.2-bc3/fw_1.4.2-bc3/upgrade_osu_1.4.2_bc3"
      // latestFirmware.firmware_key = "nanos/1.4.2-bc3/fw_1.4.2-bc3/upgrade_osu_1.4.2_bc3_key"
      // latestFirmware.name = "1.4.2-bc3-osu"

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
            step: 'confirm-identifier',
            status: Lockbox.utils.formatFirmwareHash(osuFirmware.hash)
          })
        )
        // uninstall apps to ensure room for firmware
        yield put(A.uninstallApplication('BCH'))
        yield take([
          AT.UNINSTALL_APPLICATION_FAILURE,
          AT.UNINSTALL_APPLICATION_SUCCESS
        ])
        yield put(A.uninstallApplication('ETH'))
        yield take([
          AT.UNINSTALL_APPLICATION_FAILURE,
          AT.UNINSTALL_APPLICATION_SUCCESS
        ])
        yield put(A.uninstallApplication('BTC'))
        yield take([
          AT.UNINSTALL_APPLICATION_FAILURE,
          AT.UNINSTALL_APPLICATION_SUCCESS
        ])
        // fetch base socket domain
        const domainsR = yield select(selectors.core.walletOptions.getDomains)
        const domains = domainsR.getOrElse({
          ledgerSocket: 'wss://api.ledgerwallet.com'
        })
        console.info('start osu install')
        // install osu firmware
        yield call(
          Lockbox.firmware.installOsuFirmware,
          transport,
          domains.ledgerSocket,
          osuFirmware,
          deviceInfo.targetId
        )
        console.info('end osu install')
        yield put(
          A.changeFirmwareUpdateStep({
            step: 'install-firmware',
            status: ''
          })
        )
        yield delay(500)
        console.info('start final install')
        // install final firmware
        yield call(
          Lockbox.firmware.installFinalFirmware,
          transport,
          domains.ledgerSocket,
          seFirmwareFinalVersion,
          deviceInfo.targetId
        )
        console.info('end final install')
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
  /* eslint-enable */

  // installs requested application on device
  const installApplication = function*(action) {
    const { app } = action.payload
    try {
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
      // get latest info on applications
      const appInfos = yield call(api.getApplications, {
        provider: deviceInfo.providerId,
        current_se_firmware_final_version: seFirmwareVersion.id,
        device_version: deviceVersion.id
      })
      // fetch base socket domain
      const domainsR = yield select(selectors.core.walletOptions.getDomains)
      const domains = domainsR.getOrElse({
        ledgerSocket: 'wss://api.ledgerwallet.com'
      })
      // install application
      yield call(
        Lockbox.apps.installApp,
        transport,
        domains.ledgerSocket,
        deviceInfo.targetId,
        app,
        appInfos.application_versions
      )
      yield put(A.installApplicationSuccess(app))
    } catch (e) {
      yield put(A.installApplicationFailure(app, e))
      yield put(
        actions.logs.logErrorMessage(logLocation, 'installApplication', e)
      )
    }
  }

  // uninstalls requested application on device
  const uninstallApplication = function*(action) {
    const { app } = action.payload
    try {
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
      // get latest info on applications
      // TODO: does Ledger have endpoint for single app info instead of all?
      const appInfos = yield call(api.getApplications, {
        provider: deviceInfo.providerId,
        current_se_firmware_final_version: seFirmwareVersion.id,
        device_version: deviceVersion.id
      })
      const appNameMap = {
        BTC: 'Bitcoin',
        BCH: 'Bitcoin Cash',
        ETH: 'Ethereum'
      }
      const appInfo = find(propEq('name', appNameMap[app]))(
        prop('application_versions', appInfos)
      )
      // fetch base socket domain
      const domainsR = yield select(selectors.core.walletOptions.getDomains)
      const domains = domainsR.getOrElse({
        ledgerSocket: 'wss://api.ledgerwallet.com'
      })
      // uninstall application
      yield call(
        Lockbox.apps.uninstallApp,
        transport,
        domains.ledgerSocket,
        deviceInfo.targetId,
        appInfo
      )
      yield put(A.uninstallApplicationSuccess(app))
    } catch (e) {
      yield put(A.uninstallApplicationFailure(app, e))
      yield put(
        actions.logs.logErrorMessage(logLocation, 'uninstallApplication', e)
      )
    }
  }

  // installs blockchain standard apps (BTC, BCH, ETH)
  // TODO: remove Blockchain install saga once app store is introduced
  const installBlockchainApps = function*(action) {
    try {
      const { deviceIndex } = action.payload
      yield put(A.resetAppsInstallStatus())
      yield put(A.installBlockchainAppsLoading())
      // derive device type
      const deviceR = yield select(
        selectors.core.kvStore.lockbox.getDevice,
        deviceIndex
      )
      const device = deviceR.getOrFail()
      // poll for device connection on dashboard
      yield put(A.pollForDeviceApp('DASHBOARD', null, device.device_type))
      yield take(AT.SET_CONNECTION_INFO)
      // install BTC app
      yield put(A.installApplication('BTC'))
      yield take([
        AT.INSTALL_APPLICATION_FAILURE,
        AT.INSTALL_APPLICATION_SUCCESS
      ])
      // install BCH app
      yield put(A.installApplication('BCH'))
      yield take([
        AT.INSTALL_APPLICATION_FAILURE,
        AT.INSTALL_APPLICATION_SUCCESS
      ])
      // install ETH app
      yield put(A.installApplication('ETH'))
      yield take([
        AT.INSTALL_APPLICATION_FAILURE,
        AT.INSTALL_APPLICATION_SUCCESS
      ])
      yield put(A.installBlockchainAppsSuccess())
    } catch (e) {
      yield put(A.installBlockchainAppsFailure(e))
      yield put(
        actions.logs.logErrorMessage(logLocation, 'installBlockchainApps', e)
      )
    }
  }

  return {
    checkDeviceAuthenticity,
    deleteDevice,
    pollForDeviceChannel,
    determineLockboxRoute,
    initializeDashboard,
    initializeNewDeviceSetup,
    installApplication,
    installBlockchainApps,
    pollForDeviceApp,
    saveNewDeviceKvStore,
    uninstallApplication,
    updateDeviceFirmware,
    updateDeviceName,
    updateTransactionList
  }
}
