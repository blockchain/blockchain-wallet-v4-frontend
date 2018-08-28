import { call, put, race, select } from 'redux-saga/effects'
import { contains, keysIn } from 'ramda'

import { actions, selectors } from 'data'
import * as A from './actions'
import * as C from 'services/AlertService'
import * as S from './selectors'
import LockboxService from 'services/LockboxService'

const logLocation = 'components/lockbox/sagas'

export default ({ api, coreSagas }) => {
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
      // reset new device setup to step 1
      yield put(A.changeDeviceSetupStep('setup-type'))
      yield put(actions.alerts.displaySuccess(C.LOCKBOX_SETUP_SUCCESS))
    } catch (e) {
      yield put(A.saveNewDeviceKvStoreFailure(e))
      yield put(actions.alerts.displayError(C.LOCKBOX_SETUP_ERROR))
      yield put(actions.logs.logErrorMessage(logLocation, 'storeDeviceName', e))
    }
  }

  const updateDeviceBalanceDisplay = function*(action) {
    try {
      const { deviceID, showBalances } = action.payload
      yield put(A.updateDeviceBalanceDisplayLoading())
      yield put(
        actions.core.kvStore.lockbox.updateDeviceBalanceDisplay(
          deviceID,
          showBalances
        )
      )
      yield put(A.updateDeviceBalanceDisplaySuccess())
      yield put(actions.alerts.displaySuccess(C.LOCKBOX_UPDATE_SUCCESS))
    } catch (e) {
      yield put(A.updateDeviceBalanceDisplayFailure())
      yield put(actions.alerts.displayError(C.LOCKBOX_UPDATE_ERROR))
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'updateDeviceBalanceDisplay',
          e
        )
      )
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
      const dashboardTransport = yield race({
        ledger: yield call(
          LockboxService.connections.pollForAppConnection,
          'ledger',
          'DASHBOARD',
          setupTimeout
        ),
        blockchain: call(
          LockboxService.connections.pollForAppConnection,
          'blockchain',
          'DASHBOARD',
          setupTimeout
        )
      })
      // dashboard detected, user has completed setup steps on device
      // determine the deviceType based on which channel returned
      const deviceType = keysIn(dashboardTransport)[0]
      yield put(A.storeTransportObject(dashboardTransport[deviceType]))
      yield put(A.changeDeviceSetupStep('open-btc-app'))
      const btcTransport = yield call(
        LockboxService.connections.pollForAppConnection,
        deviceType,
        'BTC'
      )
      yield put(A.storeTransportObject(btcTransport))
      const btcConnection = LockboxService.connections.createBtcConnection(
        btcTransport
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
      // TODO: handle connection timeouts gracefully..
      window.alert('DEVICE CONNECTION TIMEOUT') // eslint-disable-line
      yield put(
        actions.logs.logErrorMessage(logLocation, 'initializeNewDeviceSetup', e)
      )
    }
  }

  return {
    deleteDevice,
    determineLockboxRoute,
    initializeNewDeviceSetup,
    saveNewDeviceKvStore,
    updateDeviceName,
    updateDeviceBalanceDisplay
  }
}
