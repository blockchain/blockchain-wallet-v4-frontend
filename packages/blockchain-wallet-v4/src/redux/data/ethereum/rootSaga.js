import {call, put, takeEvery, takeLatest} from 'redux-saga/effects'
import { compose, dissoc, mapObjIndexed, negate, prop, sortBy, sum, values } from 'ramda'
import { delay } from 'redux-saga'
import { delayAjax } from '../../paths'
import * as AT from './actionTypes'
import * as A from './actions'

export default ({ api } = {}) => {
  const fetchData = function * (action) {
    try {
      yield put(A.fetchDataLoading())
      const { context } = action.payload
      const data = yield call(api.getEthereumData, context)
      const latestBlock = yield call(api.getEthereumLatestBlock)
      // Accounts treatments
      const finalBalance = sum(values(data).map(obj => obj.balance))
      const totalReceived = sum(values(data).map(obj => obj.totalReceived))
      const totalSent = sum(values(data).map(obj => obj.totalSent))
      const nTx = sum(values(data).map(obj => obj.txn_count))
      const addresses = mapObjIndexed((num, key, obj) => dissoc('txns', num), data)
      const transactions = mapObjIndexed((num, key, obj) => sortBy(compose(negate, prop('timeStamp')), prop('txns', num)), data)

      const ethereumData = {
        addresses,
        info: {
          n_tx: nTx,
          total_received: totalReceived,
          total_sent: totalSent,
          final_balance: finalBalance
        },
        latest_block: latestBlock,
        transactions
      }
      yield call(delay, delayAjax)
      yield put(A.fetchDataSuccess(ethereumData))
    } catch (e) {
      yield put(A.fetchDataFailure(e.message))
    }
  }

  const fetchFee = function * () {
    try {
      yield put(A.fetchFeeLoading())
      const data = yield call(api.getEthereumFee)
      yield call(delay, delayAjax)
      yield put(A.fetchFeeSuccess(data))
    } catch (e) {
      yield put(A.fetchFeeFailure(e.message))
    }
  }

  const fetchLatestBlock = function * () {
    try {
      yield put(A.fetchLatestBlockLoading())
      const data = yield call(api.getEthereumLatestBlock)
      yield call(delay, delayAjax)
      yield put(A.fetchLatestBlockSuccess(data))
    } catch (e) {
      yield put(A.fetchLatestBlockFailure(e.message))
    }
  }

  const fetchRates = function * () {
    try {
      yield put(A.fetchRatesLoading())
      const data = yield call(api.getEthereumTicker)
      yield call(delay, delayAjax)
      yield put(A.fetchRatesSuccess(data))
    } catch (e) {
      yield put(A.fetchRatesFailure(e.message))
    }
  }

  const fetchTransactions = function * ({ address }) {
    try {
      yield put(A.fetchTransactionsLoading())
      const data = yield call(api.getEthereumData, address)
      yield call(delay, delayAjax)
      yield put(A.fetchTransactionsSuccess(data))
    } catch (e) {
      yield put(A.fetchTransactionsFailure(e.message))
    }
  }

  return function * () {
    yield takeLatest(AT.FETCH_ETHEREUM_DATA, fetchData)
    yield takeLatest(AT.FETCH_ETHEREUM_FEE, fetchFee)
    yield takeLatest(AT.FETCH_ETHEREUM_LATEST_BLOCK, fetchLatestBlock)
    yield takeLatest(AT.FETCH_ETHEREUM_RATES, fetchRates)
    yield takeLatest(AT.FETCH_ETHEREUM_TRANSACTIONS, fetchTransactions)
  }
}
