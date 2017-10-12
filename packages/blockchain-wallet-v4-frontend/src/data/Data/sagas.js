import { takeEvery, put, call, all, select } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../actions.js'
import * as selectors from '../selectors.js'
import * as sagas from '../sagas.js'

const initData = function * (action) {
  try {
    const context = yield select(selectors.core.wallet.getWalletContext)
    yield all([
      call(sagas.core.common.fetchBlockchainData, { context }),
      call(sagas.core.rates.refreshEthereumRates),
      call(sagas.core.rates.refreshBitcoinRates)
    ])
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch data.'))
  }
}

const getAdverts = function * (action) {
  try {
    yield call(sagas.core.adverts.fetchAdverts, action.payload)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch adverts.'))
  }
}

const getCaptcha = function * (action) {
  try {
    yield call(sagas.core.captcha.fetchCaptcha)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch captcha.'))
  }
}

const getPriceIndexSeries = function * (action) {
  try {
    yield call(sagas.core.charts.fetchPriceIndexSeries, action.payload)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch price index series.'))
  }
}

const getLogs = function * (action) {
  try {
    yield call(sagas.core.logs.fetchLogs)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch logs.'))
  }
}

const getTransactions = function * (action) {
  const { address } = action.payload
  try {
    yield call(sagas.core.transactions.fetchTransactions, { address })
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch transactions.'))
  }
}

export default function * () {
  yield takeEvery(AT.INIT_DATA, initData)
  yield takeEvery(AT.GET_ADVERTS, getAdverts)
  yield takeEvery(AT.GET_CAPTCHA, getCaptcha)
  yield takeEvery(AT.GET_PRICE_INDEX_SERIES, getPriceIndexSeries)
  yield takeEvery(AT.GET_LOGS, getLogs)
  yield takeEvery(AT.GET_TRANSACTIONS, getTransactions)
}
