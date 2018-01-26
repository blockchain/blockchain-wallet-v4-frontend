
import { CREATE_PAYMENT_REQUEST} from './actionTypes'
import { peerStaticRemote} from './selectors'
import { takeEvery} from 'redux-saga'
import { encode } from '../crypto/payment_parser'
import { storePaymentRequest } from './actions'
import { rootOptions } from '../root/selectors'
import { call, put, select} from 'redux-saga/effects'

export const paymentRequestSagas = () => {

  const createPaymentRequest = function * (action) {
    console.error('create!!')
    // let {actionType, amount, description, timeout, fallbackAddress} = action
    //
    // let paymentRequest = {
    //   prefix: 'lntb',  // This means test, should be lncb in prod
    //   timestamp: 0, // TODO now
    //   amount: amount,
    //   tags: {
    //     description: description,
    //     expiry_time: timeout,
    //     segwit: {
    //       version: 0,
    //       payload: fallbackAddress
    //     }
    //   }
    // }
    //
    // yield put(storePaymentRequest(paymentRequest))
    //
    // let address = encode(payment)

    let options = yield select(rootOptions)
    let privateKey = options.staticLocal.priv
    console.log(privateKey)

    // TODO generate signature and checksum
    //console.log(address)

    // TODO return?

  }

  const takeSagas = function * () {
    yield takeEvery(CREATE_PAYMENT_REQUEST, createPaymentRequest)
  }

  return {
    takeSagas
  }
}

