import { takeEvery } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import * as A from './actions'
import * as T from './actionTypes'
import { prop, is } from 'ramda'

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

  return function * () {
    yield takeEvery(T.PAYMENT_GET_UNSPENTS, getUnspentsSaga)
  }
}
