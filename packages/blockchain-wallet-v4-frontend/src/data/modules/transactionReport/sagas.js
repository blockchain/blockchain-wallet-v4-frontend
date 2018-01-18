import { takeEvery, put, call } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'
import * as sagas from '../../sagas.js'

export const initTransactionReport = function * (action) {
  const { address, start, end } = action.payload
  try {
    yield call(sagas.core.data.bitcoin.fetchTransactionHistory, { address, start, end })
  } catch (e) {
    yield put(actions.alerts.displayError('Could not init transaction history.'))
  }
}

export default function * () {
  yield takeEvery(AT.INIT_TRANSACTION_REPORT, initTransactionReport)
}
