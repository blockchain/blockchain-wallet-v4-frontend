import { call, put, take } from 'redux-saga/effects'
import { eventChannel, END } from 'redux-saga'
import * as actions from '../../actions'
import * as A from './actions'

import Btc from '@ledgerhq/hw-app-btc'
import Transport from '@ledgerhq/hw-transport-u2f'

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
          const btcResult = await lockbox.getWalletPublicKey("44'/0'/0'/0'")
          // eth bip44 path is m/44'/60'/0'/0
          const ethResult = await lockbox.getWalletPublicKey("44'/60'/0'/0")
          // TODO:: BCH
          emitter({ btcResult, ethResult })
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
          let { btcResult, ethResult } = yield take(chan)
          yield put(A.deviceInfoSuccess({ btcResult, ethResult }))
          // TODO:: check if xpub is stored in metadata
          // if it is check if user has confirmed backup
          // if it is not, save it and ask for backup
        }
      } finally {
        chan.close()
      }
    } catch (e) {
      yield put(A.deviceInfoFailure(e))
      actions.logs.logErrorMessage(logLocation, 'initializeConnect', e)
    }
  }

  const deriveCarbonXpubs = function*() {
    try {
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'deriveCarbonXpubs', e)
      )
    }
  }

  return {
    deriveCarbonXpubs,
    initializeConnect
  }
}
