
import { CREATE_PAYMENT_REQUEST} from './actionTypes'
import { peerStaticRemote} from './selectors'
import { takeEvery, delay} from 'redux-saga'
import { encode } from '../crypto/payment_parser'
import { storePaymentRequest } from './actions'
import { rootOptions } from '../root/selectors'
import { call, put, select} from 'redux-saga/effects'
import {getRandomBytes} from '../helper'

export const paymentRequestSagas = () => {

  const createPaymentRequest = function * (action) {
    let {actionType, amount, description, timeout, fallbackAddress} = action

    let paymentRequest = {
      prefix: 'lntb',  // This means test, should be lncb in prod
      timestamp: Date.now(),
      amount: amount,
      tags: {
        description: description,
        expiry_time: timeout

      }
    }
    switch (fallbackAddress.type) {
      case 0: paymentRequest.tags['segwit'] = {version: fallbackAddress.type, payload: fallbackAddress.address}; break
      case 17: paymentRequest.tags['P2PKH'] = fallbackAddress.address; break
      case 18: paymentRequest.tags['P2SH'] = fallbackAddress.address; break
      default: throw new Error('Invalid fallback address type')
    }

    let paymentHash = getRandomBytes(32)

    yield put(storePaymentRequest(paymentHash, paymentRequest))

    paymentRequest.tags['payment_hash'] = paymentHash

    let options = yield select(rootOptions)
    let privateKey = options.staticLocal.priv

    let encodedPaymentRequest = encode(paymentRequest, privateKey)
    return encodedPaymentRequest
}

  const takeSagas = function * () {
    yield takeEvery(CREATE_PAYMENT_REQUEST, createPaymentRequest)
  }

  return {
    takeSagas
  }
}

