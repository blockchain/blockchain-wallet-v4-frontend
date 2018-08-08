import { call, put, take, select } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'
import { contains, keysIn } from 'ramda'
import Btc from '@ledgerhq/hw-app-btc'
import Transport from '@ledgerhq/hw-transport-u2f'

import { actions, selectors } from 'data'
import * as A from './actions'
import * as C from 'services/AlertService'
import * as S from './selectors'
import { getDeviceID, generateAccountsMDEntry } from 'services/LockboxService'

export default ({ api, coreSagas }) => {
  const logLocation = 'components/lockbox/sagas'

  const deviceInfoChannel = function () {
    return eventChannel(emitter => {
      async function getDeviceInfo () {
        try {
          const transport = await Transport.create()
          const lockbox = new Btc(transport)
          // get public key and chaincode for btc and eth paths
          const btc = await lockbox.getWalletPublicKey("44'/0'/0'")
          const bch = await lockbox.getWalletPublicKey("44'/145'/0'")
          const eth = await lockbox.getWalletPublicKey("44'/60'/0'/0/0")
          emitter({ btc, bch, eth })
          emitter(END)
        } catch (e) {
          throw new Error(e)
        }
      }

      getDeviceInfo()
      return () => {}
    })
  }

  const initializeDeviceConnection = function*() {
    try {
      yield put(A.deviceInfoLoading())
      const chan = yield call(deviceInfoChannel)
      try {
        while (true) {
          const { btc, bch, eth } = yield take(chan)
          yield put(A.deviceInfoSuccess({ btc, bch, eth }))
        }
      } finally {
        chan.close()
      }
    } catch (e) {
      yield put(A.deviceInfoFailure(e))
      yield put(
        actions.logs.logErrorMessage(
          logLocation,
          'initializeDeviceConnection',
          e
        )
      )
    }
  }

  const deriveConnectStep = function*() {
    try {
      const deviceInfoR = yield select(S.getConnectedDevice)
      const deviceInfo = deviceInfoR.getOrFail('missing_device')
      const newDeviceID = getDeviceID(deviceInfo)
      const devicesR = yield select(selectors.core.kvStore.lockbox.getDevices)
      const storedDevices = devicesR.getOrElse({})

      // check if device has already been added
      if (contains(newDeviceID)(keysIn(storedDevices))) {
        yield put(A.changeDeviceSetupStep('duplicate-device'))
      } else {
        yield put(A.setNewDeviceID(newDeviceID))
        yield put(A.changeDeviceSetupStep('name-device'))
      }
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'deriveConnectStep', e)
      )
    }
  }

  const saveNewDeviceKvStore = function*() {
    try {
      yield put(A.saveNewDeviceKvStoreLoading())
      const deviceInfoR = yield select(S.getConnectedDevice)
      const deviceInfo = deviceInfoR.getOrFail('missing_device')
      // derive device accounts and other information
      const mdAccountsEntry = generateAccountsMDEntry(deviceInfo)
      const deviceId = yield select(S.getNewDeviceSetupId)
      const deviceName = yield select(S.getNewDeviceSetupName)
      // store device in kvStore
      yield put(
        actions.core.kvStore.lockbox.createNewDeviceEntry(
          deviceId,
          deviceName,
          mdAccountsEntry
        )
      )
      yield put(A.saveNewDeviceKvStoreSuccess())
      yield put(actions.modals.closeModal())
      yield put(actions.alerts.displaySuccess(C.LOCKBOX_SETUP_SUCCESS))
      yield put(actions.core.data.bitcoin.fetchData())
      // reset new device setup to step 1
      // do we want to clear out previous new device data?
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

  return {
    initializeDeviceConnection,
    deriveConnectStep,
    saveNewDeviceKvStore,
    updateDeviceName,
    updateDeviceBalanceDisplay,
    deleteDevice
  }
}
