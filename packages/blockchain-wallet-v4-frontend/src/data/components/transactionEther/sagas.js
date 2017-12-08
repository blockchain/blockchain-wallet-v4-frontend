import { takeEvery, put, call } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'
import * as sagas from '../../sagas.js'

export const init = function * (action) {
  const { address } = action.payload
  try {
    yield call(sagas.core.data.ethereum.fetchTransactions, { address })
  } catch (e) {
    yield put(actions.alerts.displayError('Could not init ether transactions.'))
  }
}

export default function * () {
  yield takeEvery(AT.INIT_ETHER_TRANSACTIONS, init)
}
