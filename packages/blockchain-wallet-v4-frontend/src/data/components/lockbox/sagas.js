import { call, put, take, select } from 'redux-saga/effects'
import { contains, keysIn, prop } from 'ramda'

import { actions, selectors } from 'data'
import * as A from './actions'
import * as AT from './actionTypes'
import * as C from 'services/AlertService'
import * as S from './selectors'
import * as CC from 'services/ConfirmService'
import * as LockboxService from 'services/LockboxService'
import { confirm } from 'services/SagaService'

const logLocation = 'components/lockbox/sagas'

export default ({ api, coreSagas }) => {
  /**
   * Polls for device application to be opened
   * @param {String} action.app - Requested application to wait for
   * @param {String} [action.deviceId] - Optional unique device ID
   * @param {String} [action.deviceType] - Optional device type (ledger or blockchain)
   * @param {Number} [action.timeout] - Optional length of time in ms to wait for a connection
   * @returns {Action} Yields device connected action
   */
  const pollForDeviceApp = function*(action) {
    try {
      let { appRequested, deviceId, deviceType, timeout } = action.payload
      if (!deviceId && !deviceType) {
        throw new Error('deviceId or deviceType is required')
      }
      // close previous transport and reset old connection info
      const { transport } = yield select(S.getCurrentConnection)
      if (transport) transport.close()
      yield put(A.resetConnectionStatus())

      if (!deviceType) {
        const deviceR = yield select(
          selectors.core.kvStore.lockbox.getDevice,
          deviceId
        )
        const device = deviceR.getOrElse({})
        deviceType = prop('device_type', device)
      }

      const appConnection = yield LockboxService.connections.pollForAppConnection(
        deviceType,
        appRequested,
        timeout
      )
      yield put(
        A.setConnectionInfo(
          appConnection.app,
          deviceId,
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
      const { transport } = yield select(S.getCurrentConnection)
      // get base device info
      const deviceInfo = yield call(
        LockboxService.firmware.getDeviceInfo,
        transport
      )
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
        LockboxService.firmware.checkDeviceAuthenticity,
        transport,
        domains.ledgerSocket,
        {
          targetId: deviceInfo.targetId,
          perso: firmware.perso
        }
      )
      isDeviceAuthentic
        ? yield put(A.checkDeviceAuthenticitySuccess(isDeviceAuthentic))
        : yield put(A.changeDeviceSetupStep('error-step', true, 'authenticity'))
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
      const devicesR = yield select(selectors.core.kvStore.lockbox.getDevices)
      const devices = devicesR.getOrElse({})

      keysIn(devices).length
        ? yield put(actions.router.push('/lockbox/dashboard/0'))
        : yield put(actions.router.push('/lockbox/onboard'))
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
      const mdAccountsEntry = LockboxService.accounts.generateAccountsMDEntry(
        newDevice,
        deviceName
      )
      // store device in kvStore
      yield put(
        actions.core.kvStore.lockbox.createNewDeviceEntry(mdAccountsEntry)
      )
      yield put(A.saveNewDeviceKvStoreSuccess())
      yield put(actions.modals.closeModal())
      yield put(actions.router.push('/lockbox/dashboard/0'))
      yield put(actions.core.data.bch.fetchData())
      yield put(actions.core.data.bitcoin.fetchData())
      yield put(actions.core.data.ethereum.fetchData())
      yield put(actions.alerts.displaySuccess(C.LOCKBOX_SETUP_SUCCESS))
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
      const { deviceID, deviceName } = action.payload
      yield put(A.updateDeviceNameLoading())
      yield put(
        actions.core.kvStore.lockbox.storeDeviceName(deviceID, deviceName)
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
      const { deviceID } = action.payload
      const confirmed = yield call(confirm, {
        title: CC.CONFIRM_DELETE_LOCKBOX_TITLE,
        message: CC.CONFIRM_DELETE_LOCKBOX_MESSAGE,
        nature: 'warning'
      })
      if (confirmed) {
        try {
          yield put(A.deleteDeviceLoading())
          yield put(actions.core.kvStore.lockbox.deleteDeviceLockbox(deviceID))
          yield put(actions.router.push('/lockbox'))
          yield put(A.deleteDeviceSuccess())
          yield put(actions.alerts.displaySuccess(C.LOCKBOX_DELETE_SUCCESS))
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

  // new device setup saga
  const initializeNewDeviceSetup = function*() {
    try {
      yield put(A.changeDeviceSetupStep('connect-device'))
      const setupTimeout = 1500000 // 25 min timeout for setup
      // TODO: poll for both Ledger and Blockchain type devices
      const deviceType = 'ledger'
      yield put(A.pollForDeviceApp('DASHBOARD', null, deviceType, setupTimeout))
      yield take(AT.SET_CONNECTION_INFO)
      yield take(AT.SET_NEW_DEVICE_SETUP_STEP)
      // check device authenticity
      yield put(A.checkDeviceAuthenticity())
      yield take(AT.SET_NEW_DEVICE_SETUP_STEP)
      // wait for BTC connection
      yield put(A.pollForDeviceApp('BTC', null, deviceType))
      yield take(AT.SET_CONNECTION_INFO)
      const { transport } = yield select(S.getCurrentConnection)
      const btcConnection = LockboxService.connections.createBtcBchConnection(
        transport
      )
      // derive device info (chaincodes and xpubs)
      const newDeviceInfo = yield call(
        LockboxService.accounts.deriveDeviceInfo,
        btcConnection
      )
      // derive a unique deviceId hashed from btc xpub
      const newDeviceId = yield call(
        LockboxService.accounts.deriveDeviceId,
        newDeviceInfo.btc
      )
      yield put(
        A.setNewDeviceInfo({
          id: newDeviceId,
          info: newDeviceInfo,
          type: deviceType
        })
      )
      const storedDevicesR = yield select(
        selectors.core.kvStore.lockbox.getDevices
      )
      const storedDevices = storedDevicesR.getOrElse({})
      // check if device has already been added
      if (contains(newDeviceId)(keysIn(storedDevices))) {
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

  const initializeDashboard = function*() {
    const btcContextR = yield select(
      selectors.core.kvStore.lockbox.getLockboxBtcContext
    )
    const bchContextR = yield select(
      selectors.core.kvStore.lockbox.getLockboxBchContext
    )
    const ethContextR = yield select(
      selectors.core.kvStore.lockbox.getLockboxEthContext
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

  const updateTransactionList = function*() {
    // TODO: onlyShow and filtering
    const btcContextR = yield select(
      selectors.core.kvStore.lockbox.getLockboxBtcContext
    )
    const bchContextR = yield select(
      selectors.core.kvStore.lockbox.getLockboxBchContext
    )
    const ethContextR = yield select(
      selectors.core.kvStore.lockbox.getLockboxEthContext
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
  const updateDeviceFirmware = function*(action) {
    try {
      const { deviceID } = action.payload
      // clear out previous firmware info
      yield put(A.resetFirmwareInfo())
      // poll for device connection
      yield put(A.pollForDeviceApp('DASHBOARD', deviceID))
      yield take(AT.SET_CONNECTION_INFO)
      const { transport } = yield select(S.getCurrentConnection)
      // get base device info
      const deviceInfo = yield call(
        LockboxService.firmware.getDeviceInfo,
        transport
      )
      yield put(A.setFirmwareInstalledInfo(deviceInfo))
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
      yield put(
        A.setFirmwareLatestInfo({
          version: seFirmwareVersion.name,
          deviceOutdated: latestFirmware.result !== 'null'
        })
      )

      // TODO: blocked until we get some outdated devices...
      if (latestFirmware.result !== 'null') {
        // device firmware is out of date
        // lines 56-75 in helpers/devices/getLatestFirmwareForDevice.js
        yield put(A.changeFirmwareUpdateStep('upgrade-firmware-step'))
      }
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'updateDeviceFirmware', e)
      )
    } finally {
      yield put(A.changeFirmwareUpdateStep('check-for-updates-step'))
    }
  }

  return {
    checkDeviceAuthenticity,
    deleteDevice,
    determineLockboxRoute,
    initializeDashboard,
    initializeNewDeviceSetup,
    pollForDeviceApp,
    saveNewDeviceKvStore,
    updateDeviceFirmware,
    updateDeviceName,
    updateTransactionList
  }
}
