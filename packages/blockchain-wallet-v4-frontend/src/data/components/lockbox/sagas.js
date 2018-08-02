import { call, put, take, select } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'
import { actions, selectors } from 'data'
import * as A from './actions'
import * as S from './selectors'

import Btc from '@ledgerhq/hw-app-btc'
import Transport from '@ledgerhq/hw-transport-u2f'
import { getDeviceID, generateMDEntry } from 'services/LockboxService'

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
          // btc bip44 path is m/44'/0'/0'/0
          const btc = await lockbox.getWalletPublicKey("44'/0'/0'")
          // eth bip44 path is m/44'/60'/0'/0
          const eth = await lockbox.getWalletPublicKey("44'/60'/0'")
          // TODO:: BCH
          emitter({ btc, eth })
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
          const { btc, eth } = yield take(chan)
          yield put(A.deviceInfoSuccess({ btc, eth }))
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
      } else if (!device.confirmed) {
        yield put(A.setConnectStep('confirm-recovery'))
      } else {
        yield put(actions.modals.closeAll)
      }
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'deriveConnectStep', e)
      )
    }
  }

  const addDevice = function*(action) {
    try {
      const { deviceName } = action.payload

      yield put(A.addDeviceLoading())
      const deviceInfoR = yield select(S.getDeviceInfo)
      const deviceInfo = deviceInfoR.getOrFail('missing_device')
      const deviceID = getDeviceID(deviceInfo)
      yield put(
        actions.core.kvStore.lockbox.addDeviceLockbox(deviceID, deviceName)
      )
      yield put(A.addDeviceSuccess())
      yield put(A.setConnectStep('confirm-recovery'))
    } catch (e) {
      yield put(A.addDeviceFailure(e))
      yield put(actions.logs.logErrorMessage(logLocation, 'addDevice', e))
    }
  }

  const saveDevice = function*() {
    try {
      yield put(A.saveDeviceLoading())
      const deviceInfoR = yield select(S.getDeviceInfo)
      const deviceInfo = deviceInfoR.getOrFail('missing_device')
      const deviceID = getDeviceID(deviceInfo)
      const mdEntry = generateMDEntry(deviceInfo)
      yield put(
        actions.core.kvStore.lockbox.saveDeviceLockbox(deviceID, mdEntry)
      )
      yield put(A.saveDeviceSuccess())
    } catch (e) {
      yield put(A.saveDeviceFailure(e))
      yield put(actions.logs.logErrorMessage(logLocation, 'saveDevice', e))
    }
  }

  return {
    initializeConnect,
    deriveConnectStep,
    saveDevice,
    addDevice
  }
}
