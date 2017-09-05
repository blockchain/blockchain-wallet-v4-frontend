import { call, put, select, takeLatest, takeEvery } from 'redux-saga/effects'
import * as A from './actions'
import * as T from './actionTypes'
import { prop, is } from 'ramda'
import { sign } from '../../../signer'
import { futurizeP } from 'futurize'
import Task from 'data.task'

const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

export const paymentSaga = ({ api, walletPath, dataPath } = {}) => {

  const getUnspentsSaga = function * (action) {
    try {
      const { index, address } = action.payload
      const source = is(Number, index) ? index : address
      const wrapper = yield select(prop(walletPath))
      const coins = yield call(api.getWalletUnspents, wrapper, source)
      yield put(A.getUnspentsSuccess(coins))
    } catch (e) {
      yield put(A.getUnspentsError(e))
    }
  }

  const signAndPublishSaga = function * (action) {
    const { network, selection, secondPassword } = action.payload
    const wrapper = yield select(prop(walletPath))
    const signAndPublish = (sel, pass) => taskToPromise(sign(network, pass, wrapper, sel).chain(futurizeP(Task)(api.pushTx)))
    try {
      const hex = yield call(signAndPublish, selection, secondPassword)
      yield put(A.signAndPublishSuccess(hex))
    } catch (e) {
      yield put(A.signAndPublishError(e))
    }
  }

  return function * () {
    yield takeEvery(T.PAYMENT_GET_UNSPENTS, getUnspentsSaga)
    yield takeLatest(T.SIGN_AND_PUBLISH, signAndPublishSaga)
  }
}
