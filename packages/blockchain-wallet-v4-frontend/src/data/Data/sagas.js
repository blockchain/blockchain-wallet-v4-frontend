import { takeEvery, put, call } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../actions.js'
import * as sagas from '../sagas.js'

export const getAdverts = function * (action) {
  try {
    yield call(sagas.core.data.misc.fetchAdverts, action.payload)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch adverts.'))
  }
}

export const getCaptcha = function * (action) {
  try {
    yield call(sagas.core.data.misc.fetchCaptcha)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch captcha.'))
  }
}

export const getPriceIndexSeries = function * (action) {
  try {
    yield call(sagas.core.data.misc.fetchPriceIndexSeries, action.payload)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch price index series.'))
  }
}

export const getLogs = function * (action) {
  try {
    yield call(sagas.core.data.misc.fetchLogs)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch logs.'))
  }
}

export const getBitcoinTransactions = function * (action) {
  const { address } = action.payload
  try {
    yield call(sagas.core.data.bitcoin.fetchTransactions, { address })
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch bitcoin transactions.'))
  }
}

export const getEthereumTransactions = function * (action) {
  const { address } = action.payload
  try {
    yield call(sagas.core.data.ethereum.fetchTransactions, { address })
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch ethereum transactions.'))
  }
}

const getTransactionFiatAtTime = function * (action) {
  const { coin, hash, amount, time } = action.payload
  try {
    yield call(sagas.core.data.bitcoin.fetchTransactionFiatAtTime, { coin, hash, amount, time })
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch transaction fiat at time.'))
  }
}

const getTransactionHistory = function * (action) {
  const { address, start, end } = action.payload
  try {
    yield call(sagas.core.data.misc.fetchTransactionHistory, { address, start, end })
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch transaction history data.'))
  }
}

export default function * () {
  yield takeEvery(AT.GET_ADVERTS, getAdverts)
  yield takeEvery(AT.GET_CAPTCHA, getCaptcha)
  yield takeEvery(AT.GET_PRICE_INDEX_SERIES, getPriceIndexSeries)
  yield takeEvery(AT.GET_LOGS, getLogs)
  yield takeEvery(AT.GET_BITCOIN_TRANSACTIONS, getBitcoinTransactions)
  yield takeEvery(AT.GET_ETHEREUM_TRANSACTIONS, getEthereumTransactions)
  yield takeEvery(AT.GET_TRANSACTION_FIAT_AT_TIME, getTransactionFiatAtTime)
  yield takeEvery(AT.GET_TRANSACTION_HISTORY, getTransactionHistory)
}
