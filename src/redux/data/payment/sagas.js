import { takeEvery } from 'redux-saga'
import { call, put, select } from 'redux-saga/effects'
import * as A from './actions'
import * as T from './actionTypes'
import { prop, is } from 'ramda'
import { selectAll, effectiveBalance } from '../../../coinSelection'

export const paymentSaga = ({ api, walletPath, dataPath } = {}) => {
  const getUnspentsSaga = function * (action) {
    try {
      const { index, address } = action.payload
      const source = is(Number, index) ? index : address
      const wrapper = yield select(prop(walletPath))
      const coins = yield call(api.getWalletUnspents, wrapper, source)
      yield put(A.getUnspentsSuccess(coins))
      // const effBalance = effectiveBalance(feePerByte, inputs, outputs)
      // const destination = '1NFGxFVFvtELWd62qzoxBctyZ71TatKQVJ'
      // const selection = selectAll(55, coins, destination)
      // console.log(selection)
    } catch (e) {
      console.log(e)
    }
  }

  return function * () {
    yield takeEvery(T.PAYMENT_GET_UNSPENTS, getUnspentsSaga)
  }
}
