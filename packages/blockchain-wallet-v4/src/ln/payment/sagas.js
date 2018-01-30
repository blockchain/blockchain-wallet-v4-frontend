
import { CREATE_PAYMENT_REQUEST} from './actionTypes'
import { peerStaticRemote} from './selectors'
import { takeEvery} from 'redux-saga'
import { encode } from '../crypto/payment_parser'
import { storePaymentRequest } from './actions'
import { rootOptions } from '../root/selectors'
import { call, put, select} from 'redux-saga/effects'

export const paymentRequestSagas = () => {

  const createPaymentRequest = function * (action) {
    let {actionType, amount, description, timeout, fallbackAddress} = action

    let paymentRequest = {
      prefix: 'lntb',  // This means test, should be lncb in prod
      timestamp: Date.now(),
      amount: amount,
      tags: {
        description: description,
        expiry_time: timeout,
        payment_hash: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 1, 2],
        segwit: {
          version: 0,
          payload: fallbackAddress
        }
      }
    }
    switch (fallbackAddress.type) {
      case 0: paymentRequest['segwit'] = {version: fallbackAddress.type, payload: fallbackAddress.address}; break
      case 17: paymentRequest['P2PKH'] = fallbackAddress.address; break
      case 18: paymentRequest['P2SH'] = fallbackAddress.address; break
      default: throw new Error('Invalid fallback address type')
    }

    let options = yield select(rootOptions)
    let privateKey = options.staticLocal.priv

    let encodedPaymentRequest = encode(paymentRequest, privateKey)

    yield put(storePaymentRequest(encodedPaymentRequest))
  }

  const takeSagas = function * () {
    yield takeEvery(CREATE_PAYMENT_REQUEST, createPaymentRequest)
  }

  return {
    takeSagas
  }
}

