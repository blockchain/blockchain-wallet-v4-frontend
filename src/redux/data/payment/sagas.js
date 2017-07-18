import { takeEvery } from 'redux-saga'
import { call, put } from 'redux-saga/effects'
import * as A from './actions'
import * as T from './actionTypes'
import * as Coin from '../../../coinSelection/coin'
// import { selectAll } from '../../../coinSelection'

export const paymentSaga = ({ api } = {}) => {
  const getUnspentsSaga = function * (action) {
    try {
      let result = yield call(api.getUnspents, [action.payload])
      let coins = result.unspent_outputs.map(Coin.fromJS)
      yield put(A.getUnspentsSuccess(coins))
      // let selection = selectAll(30, coins, action.payload)
      // console.log(selection)
    } catch (e) {
      console.log(e)
    }
  }

  return function * () {
    yield takeEvery(T.PAYMENT_GET_UNSPENTS, getUnspentsSaga)
  }
}
