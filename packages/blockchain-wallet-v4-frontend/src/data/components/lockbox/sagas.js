import { call, put, race, take, select } from 'redux-saga/effects'
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
    let { appRequested, deviceId, deviceType, timeout } = action.payload
    if (!deviceId && !deviceType) throw new Error('Missing required params')

    try {
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
      // 25 min timeout for setup
      const setupTimeout = 1500000
      // poll for both Ledger and Blockchain type devices
      // TODO: ANDREW BROKE THIS! fix!
      const dashboardTransport = yield race({
        ledger: call(pollForDeviceApp, [
          'DASHBOARD',
          null,
          'ledger',
          setupTimeout
        ]),
        blockchain: call(pollForDeviceApp, [
          'DASHBOARD',
          null,
          'blockchain',
          setupTimeout
        ])
      })

      // dashboard detected, user has completed setup steps on device
      // determine the deviceType based on which channel returned
      const deviceType = keysIn(dashboardTransport)[0]
      yield put(A.changeDeviceSetupStep('open-btc-app'))

      yield put(A.pollForDeviceApp('BTC', null, deviceType))
      yield take(AT.SET_CONNECTION_INFO)
      const { transport } = yield select(S.getCurrentConnection)
      const btcConnection = LockboxService.connections.createBtcConnection(
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

  // update device firmware saga
  const updateDeviceFirmware = function*(action) {
    try {
      const { deviceID } = action.payload
      yield put(A.pollForDeviceApp('DASHBOARD', deviceID))
      yield take(AT.SET_CONNECTION_INFO)
      const { transport } = yield select(S.getCurrentConnection)
      yield put(A.changeFirmwareUpdateStep('compare-versions-step'))
      const installedFirmwareInfo = yield call(
        LockboxService.firmware.getDeviceFirmwareInfo,
        transport
      )
      yield put(A.setFirmwareInstalledInfo(installedFirmwareInfo))
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
    initializeNewDeviceSetup,
    pollForDeviceApp,
    saveNewDeviceKvStore,
    updateDeviceFirmware,
    updateDeviceName
  }
}
