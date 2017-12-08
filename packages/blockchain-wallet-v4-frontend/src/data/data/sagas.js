import { takeEvery, put, call } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../actions.js'
import * as sagas from '../sagas.js'

const getTransactionHistory = function * (action) {
  const { address, start, end } = action.payload
  try {
    yield call(sagas.core.data.misc.fetchTransactionHistory, { address, start, end })
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch transaction history data.'))
  }
}

const getBtcEth = function * (action) {
  try {
    yield call(sagas.core.data.shapeShift.fetchBtcEth)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch shapeShift data for bitcoin to ether conversion.'))
  }
}

const getEthBtc = function * (action) {
  try {
    yield call(sagas.core.data.shapeShift.fetchEthBtc)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch shapeShift data for ether to bitcoin conversion.'))
  }
}

const getShapeshiftOrderStatuses = function * (action) {
  try {
    const { addresses } = action.payload
    yield call(sagas.core.data.shapeShift.getTradesStatus, addresses)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch shapeshift trade statuses.'))
  }
}

export default function * () {
  yield takeEvery(AT.GET_TRANSACTION_HISTORY, getTransactionHistory)
  yield takeEvery(AT.GET_BTC_ETH, getBtcEth)
  yield takeEvery(AT.GET_ETH_BTC, getEthBtc)
  yield takeEvery(AT.GET_SHAPESHIFT_ORDER_STATUSES, getShapeshiftOrderStatuses)
}
