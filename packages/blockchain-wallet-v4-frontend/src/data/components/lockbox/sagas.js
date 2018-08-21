import { call, put, select } from 'redux-saga/effects'
import { contains, keysIn } from 'ramda'
import Btc from '@ledgerhq/hw-app-btc'

import { actions, selectors } from 'data'
import * as A from './actions'
import * as C from 'services/AlertService'
import * as S from './selectors'
import * as LockboxService from 'services/LockboxService'

const logLocation = 'components/lockbox/sagas'

export default ({ api, coreSagas }) => {
  // saves new device to KvStore
  const saveNewDeviceKvStore = function*(action) {
    try {
      const { deviceName } = action.payload
      yield put(A.saveNewDeviceKvStoreLoading())
      const newDeviceR = yield select(S.getNewDeviceInfo)
      const newDevice = newDeviceR.getOrFail('missing_device')
      const mdAccountsEntry = LockboxService.generateAccountsMDEntry(
        newDevice.info
      )
      // store device in kvStore
      yield put(
        actions.core.kvStore.lockbox.createNewDeviceEntry(
          newDevice.id,
          deviceName,
          mdAccountsEntry
        )
      )
      yield put(A.saveNewDeviceKvStoreSuccess())
      yield put(actions.modals.closeModal())
      yield put(actions.alerts.displaySuccess(C.LOCKBOX_SETUP_SUCCESS))
      yield put(actions.core.data.bitcoin.fetchData())
      // reset new device setup to step 1
      yield put(A.changeDeviceSetupStep('setup-type'))
    } catch (e) {
      yield put(A.saveNewDeviceKvStoreFailure(e))
      yield put(actions.alerts.displaySuccess(C.LOCKBOX_SETUP_ERROR))
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
      yield put(actions.alerts.displaySuccess(C.LOCKBOX_UPDATE_ERROR))
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
      yield put(actions.alerts.displaySuccess(C.LOCKBOX_UPDATE_ERROR))
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
      // once dashboard is detected, user has completed setup steps on device
      yield call(_pollForConnectionStatus, 'DASHBOARD', 1500000) // 25 min timeout
      yield put(A.changeDeviceSetupStep('open-btc-app'))
      yield call(_pollForConnectionStatus, 'BTC')
      const transport = yield select(S.getTransportObject)
      const btcTransport = new Btc(transport)
      // derive device info such as chaincodes and xpubs
      const newDeviceInfo = yield call(
        LockboxService.derviveDeviceInfo,
        btcTransport
      )
      // derive a unique deviceId hashed from btc xpub
      const newDeviceId = yield call(
        LockboxService.deriveDeviceID,
        newDeviceInfo.btc
      )
      yield put(A.setNewDeviceInfo({ id: newDeviceId, info: newDeviceInfo }))
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
      yield put(
        actions.logs.logErrorMessage(logLocation, 'initializeNewDeviceSetup', e)
      )
    }
  }

  //
  // PRIVATE SAGAS
  //

  // opens Transport and sends NO_OP cmd until response is received (success)
  // or timeout is hit (reject)
  const _createDeviceConnection = function (app, timeout) {
    return new Promise((resolve, reject) => {
      async function startTransportListener () {
        try {
          const transport = await LockboxService.openTransport(app, timeout)
          // TODO: wrap in setTimeout for rejections
          await LockboxService.sendNoOpCmd(transport)
          resolve(transport) // connection detected
        } catch (error) {
          reject(error)
        }
      }
      startTransportListener()
    })
  }

  // creates transport listener for specified app
  const _pollForConnectionStatus = function*(app, timeout) {
    try {
      yield put(A.pollForConnectionStatusLoading())
      const transportConnection = yield call(
        _createDeviceConnection,
        app,
        timeout
      )
      yield put(A.storeTransportObject(transportConnection))
      yield put(A.pollForConnectionStatusSuccess(true))
    } catch (e) {
      yield put(A.pollForConnectionStatusFailure())
      yield put(
        actions.logs.logErrorMessage(logLocation, 'pollForConnectionStatus', e)
      )
    }
  }

  return {
    deleteDevice,
    initializeNewDeviceSetup,
    saveNewDeviceKvStore,
    updateDeviceName,
    updateDeviceBalanceDisplay
  }
}
