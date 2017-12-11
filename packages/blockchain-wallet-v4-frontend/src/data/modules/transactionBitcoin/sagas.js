import { takeEvery, put, call } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'
import * as sagas from '../../sagas.js'

export const init = function * (action) {
  const { address } = action.payload
  try {
    yield call(sagas.core.data.bitcoin.fetchTransactions, { address })
  } catch (e) {
    yield put(actions.alerts.displayError('Could not init bitcoin transactions.'))
  }
}

const getBitcoinFiatAtTime = function * (action) {
  const { coin, hash, amount, time } = action.payload
  try {
    yield call(sagas.core.data.bitcoin.fetchTransactionFiatAtTime, { coin, hash, amount, time })
  } catch (e) {
    yield put(actions.alerts.displayError('Could not get bitcoin fiat at time.'))
  }
}

export default function * () {
  yield takeEvery(AT.INIT_BITCOIN_TRANSACTIONS, init)
  yield takeEvery(AT.GET_BITCOIN_FIAT_AT_TIME, getBitcoinFiatAtTime)
}
