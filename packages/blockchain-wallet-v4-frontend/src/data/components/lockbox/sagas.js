import { call, put, take, select } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'
import { actions, selectors } from 'data'
import * as A from './actions'
import * as C from 'services/AlertService'
import * as S from './selectors'

import Btc from '@ledgerhq/hw-app-btc'
import Transport from '@ledgerhq/hw-transport-u2f'
import { getDeviceID, generateAccountsMDEntry } from 'services/LockboxService'

export default ({ api, coreSagas }) => {
  const logLocation = 'components/lockbox/sagas'

  const deviceInfoChannel = function () {
    return eventChannel(emitter => {
      async function getDeviceInfo () {
        try {
          const transport = await Transport.create()
          // Should we let the user open any app?
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

  const initializeConnect = function*() {
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
        actions.logs.logErrorMessage(logLocation, 'initializeConnect', e)
      )
    }
  }

  const deriveConnectStep = function*() {
    try {
      const deviceInfoR = yield select(S.getDeviceInfo)
      const deviceInfo = deviceInfoR.getOrFail('missing_device')
      const deviceID = getDeviceID(deviceInfo)

      const deviceR = yield select(
        selectors.core.kvStore.lockbox.getDevice,
        deviceID
      )

      const device = deviceR.getOrElse(null)

      if (!device) {
        yield put(A.setConnectStep('name-device'))
      } else if (!device.backupConfirmed) {
        yield put(A.setConnectStep('confirm-recovery'))
      } else {
        yield put(actions.modals.closeModal())
      }
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'deriveConnectStep', e)
      )
    }
  }

  const storeDeviceName = function*(action) {
    try {
      const { deviceName } = action.payload

      yield put(A.storeDeviceNameLoading())
      const deviceInfoR = yield select(S.getDeviceInfo)
      const deviceInfo = deviceInfoR.getOrFail('missing_device')
      const deviceID = getDeviceID(deviceInfo)
      yield put(
        actions.core.kvStore.lockbox.storeDeviceName(deviceID, deviceName)
      )
      yield put(A.storeDeviceNameSuccess())
      yield put(A.setConnectStep('confirm-recovery'))
    } catch (e) {
      yield put(A.storeDeviceNameFailure(e))
      yield put(actions.logs.logErrorMessage(logLocation, 'storeDeviceName', e))
    }
  }

  const storeDeviceBackupFlag = function*() {
    try {
      yield put(A.storeDeviceBackupFlagLoading())
      const deviceInfoR = yield select(S.getDeviceInfo)
      const deviceInfo = deviceInfoR.getOrFail('missing_device')
      const deviceID = getDeviceID(deviceInfo)
      yield put(actions.core.kvStore.lockbox.storeDeviceBackupFlag(deviceID))
      yield put(A.storeDeviceBackupFlagSuccess())
      yield put(A.setConnectStep('save-accounts'))
    } catch (e) {
      yield put(A.storeDeviceBackupFlagFailure(e))
      yield put(
        actions.logs.logErrorMessage(logLocation, 'storeDeviceBackupFlag', e)
      )
    }
  }

  const storeDeviceAccounts = function*(action) {
    try {
      const { storeXpubs } = action.payload
      yield put(A.storeDeviceAccountsLoading())

      if (storeXpubs) {
        const deviceInfoR = yield select(S.getDeviceInfo)
        const deviceInfo = deviceInfoR.getOrFail('missing_device')
        const deviceID = getDeviceID(deviceInfo)
        const deviceR = yield select(
          selectors.core.kvStore.lockbox.getDevice,
          deviceID
        )
        const device = deviceR.getOrFail('device_not_stored')
        const { deviceName } = device

        const mdAccountsEntry = generateAccountsMDEntry(deviceInfo, deviceName)

        yield put(
          actions.core.kvStore.lockbox.storeDeviceAccounts(
            deviceID,
            mdAccountsEntry
          )
        )
      }
      yield put(actions.modals.closeModal())
      yield put(A.storeDeviceAccountsSuccess())
      yield put(actions.alerts.displaySuccess(C.LOCKBOX_SETUP_SUCCESS))
      yield put(actions.core.data.bitcoin.fetchData())
      yield put(A.setConnectStep('setup-type'))
    } catch (e) {
      yield put(A.storeDeviceAccountsFailure(e))
      yield put(
        actions.logs.logErrorMessage(logLocation, 'storeDeviceAccounts', e)
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
    initializeConnect,
    deriveConnectStep,
    storeDeviceAccounts,
    storeDeviceBackupFlag,
    storeDeviceName,
    deleteDevice
  }
}
