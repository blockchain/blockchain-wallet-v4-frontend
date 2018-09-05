import { call, put, take, select } from 'redux-saga/effects'
import { contains, keysIn } from 'ramda'

import { actions, selectors } from 'data'
import * as A from './actions'
import * as AT from './actionTypes'
import * as C from 'services/AlertService'
import * as S from './selectors'
import * as LockboxService from 'services/LockboxService'

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
        const storedDevicesR = yield select(
          selectors.core.kvStore.lockbox.getDevices
        )
        const storedDevices = storedDevicesR.getOrElse({})
        deviceType = storedDevices[deviceId].device_type
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

  // determines if lockbox is setup and routes app accordingly
  const determineLockboxRoute = function*() {
    try {
      const devicesR = yield select(selectors.core.kvStore.lockbox.getDevices)
      const devices = devicesR.getOrElse({})

      keysIn(devices).length
        ? yield put(actions.router.push('/lockbox/dashboard'))
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
        newDevice.info
      )
      // store device in kvStore
      yield put(
        actions.core.kvStore.lockbox.createNewDeviceEntry(
          newDevice.id,
          newDevice.type,
          deviceName,
          mdAccountsEntry
        )
      )
      yield put(A.saveNewDeviceKvStoreSuccess())
      yield put(actions.modals.closeModal())
      yield put(actions.router.push('/lockbox/dashboard'))
      yield put(actions.core.data.bitcoin.fetchData())
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
      yield put(A.deleteDeviceLoading())
      yield put(actions.core.kvStore.lockbox.deleteDeviceLockbox(deviceID))
      yield put(actions.router.push('/lockbox'))
      yield put(A.deleteDeviceSuccess())
      yield put(actions.alerts.displaySuccess(C.LOCKBOX_DELETE_SUCCESS))
    } catch (e) {
      yield put(A.deleteDeviceFailure(e))
      yield put(actions.logs.logErrorMessage(logLocation, 'deleteDevice', e))
      yield put(actions.alerts.displayError(C.LOCKBOX_DELETE_ERROR))
    }
  }

  // new device setup saga
  const initializeNewDeviceSetup = function*() {
    try {
      const setupTimeout = 1500000 // 25 min timeout for setup
      // TODO: poll for both Ledger and Blockchain type devices
      const deviceType = 'ledger'
      yield put(A.pollForDeviceApp('DASHBOARD', null, deviceType, setupTimeout))
      yield take(AT.SET_CONNECTION_INFO)
      yield put(A.changeDeviceSetupStep('open-btc-app'))
      yield put(A.pollForDeviceApp('BTC', null, deviceType))
      yield take(AT.SET_CONNECTION_INFO)
      const { transport } = yield select(S.getCurrentConnection)
      const btcConnection = LockboxService.connections.createBtcBchConnection(
        transport
      )

      // derive device info such as chaincodes and xpubs
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
        yield put(A.changeDeviceSetupStep('duplicate-device'))
      } else {
        yield put(A.changeDeviceSetupStep('name-device'))
      }
    } catch (e) {
      // TODO: more error handling
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
      yield put(A.pollForDeviceApp('DASHBOARD', deviceID))
      yield take(AT.SET_CONNECTION_INFO)
      const { transport } = yield select(S.getCurrentConnection)
      yield put(A.changeFirmwareUpdateStep('compare-versions-step'))
      const deviceInfo = yield call(
        LockboxService.firmware.getDeviceInfo,
        transport
      )
      console.info(deviceInfo) // eslint-disable-line
      yield put(A.setFirmwareInstalledInfo(deviceInfo))
      const res = yield call(
        api.getDeviceVersion,
        deviceInfo.providerId,
        deviceInfo.targetId
      )
      console.info(res) // eslint-disable-line
      // const firmwaresLatest = yield call(LockboxService.firmware.getLatestFirmwareInfo, firmwaresInstalled)
      // debugger
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'updateDeviceFirmware', e)
      )
    } finally {
      // yield put(A.changeFirmwareUpdateStep('device-connect-step'))
    }
  }

  return {
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
