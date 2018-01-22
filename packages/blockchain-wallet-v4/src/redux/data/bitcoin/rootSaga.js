
import { call, put, select, take, takeLatest, fork } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import { indexBy, length, path, prop, last, map } from 'ramda'
import { futurizeP } from 'futurize'
import Task from 'data.task'
import { sign } from '../../../signer'
import { delayAjax } from '../../paths'
import * as AT from './actionTypes'
import * as A from './actions'
import * as S from './selectors'
import * as selectors from '../../selectors'

export default ({ api } = {}) => {
  const taskToPromise = t => new Promise((resolve, reject) => t.fork(reject, resolve))

  const fetchData = function * (action) {
    try {
      yield put(A.fetchDataLoading())
      const { context } = action.payload
      const data = yield call(api.fetchBlockchainData, context, { n: 1 })
      const bitcoinData = {
        addresses: indexBy(prop('address'), prop('addresses', data)),
        info: path(['wallet'], data),
        latest_block: path(['info', 'latest_block'], data)
      }
      yield call(delay, delayAjax)
      yield put(A.fetchDataSuccess(bitcoinData))
    } catch (e) {
      yield put(A.fetchDataFailure(e.message))
    }
  }
  const fetchFee = function * () {
    try {
      yield put(A.fetchFeeLoading())
      const data = yield call(api.getBitcoinFee)
      yield call(delay, delayAjax)
      yield put(A.fetchFeeSuccess(data))
    } catch (e) {
      yield put(A.fetchFeeFailure(e.message))
    }
  }

  const fetchRates = function * () {
    try {
      yield put(A.fetchRatesLoading())
      const data = yield call(api.getBitcoinTicker)
      yield call(delay, delayAjax)
      yield put(A.fetchRatesSuccess(data))
    } catch (e) {
      yield put(A.fetchRatesFailure(e.message))
    }
  }

  const watchTransactions = function * () {
    while (true) {
      const action = yield take(AT.FETCH_BITCOIN_TRANSACTIONS)
      yield call(fetchTransactions, action)
    }
  }

  const fetchTransactions = function * ({type, payload}) {
    const { address, reset } = payload
    const TX_PER_PAGE = 50
    try {
      const pages = yield select(S.getTransactions)
      const lastPage = last(pages)
      if (!reset && lastPage && lastPage.map(length).getOrElse(0) === 0) { return }
      const offset = reset ? 0 : length(pages) * TX_PER_PAGE
      yield put(A.fetchTransactionsLoading(reset))
      const context = yield select(selectors.wallet.getWalletContext)
      const data = yield call(api.fetchBlockchainData, context, { n: TX_PER_PAGE, onlyShow: address, offset })
      yield put(A.fetchTransactionsSuccess(data.txs, reset))
    } catch (e) {
      yield put(A.fetchTransactionsFailure(e.message))
    }
  }

  const fetchTransactionHistory = function * ({ type, payload }) {
    const { address, start, end } = payload
    try {
      yield put(A.fetchTransactionHistoryLoading())
      const currency = yield select(selectors.settings.getCurrency)
      if (address) {
        const data = yield call(api.getTransactionHistory, address, currency.getOrElse('USD'), start, end)
        yield put(A.fetchTransactionHistorySuccess(data))
      } else {
        const context = yield select(selectors.wallet.getWalletContext)
        const active = context.join('|')
        const data = yield call(api.getTransactionHistory, active, currency, start, end)
        yield put(A.fetchTransactionHistorySuccess(data))
      }
    } catch (e) {
      yield put(A.fetchTransactionHistoryFailure(e.message))
    }
  }

  const fetchFiatAtTime = function * ({ type, payload }) {
    const { hash, amount, time, currency } = payload
    try {
      yield put(A.fetchFiatAtTimeLoading())
      // const currency = yield select(selectors.settings.getCurrency)
      const data = yield call(api.getBitcoinFiatAtTime, amount, time)
      yield put(A.fetchFiatAtTimeSuccess({ currency: { hash: data } }))
    } catch (e) {
      yield put(A.fetchFiatAtTimeFailure(e.message))
    }
  }

  const fetchUnspent = function * (action) {
    try {
      // source can be the hd account index / or a legacy address
      const { source } = action.payload
      yield put(A.fetchUnspentLoading())
      const wrapper = yield select(selectors.wallet.getWrapper)
      const data = yield call(api.getWalletUnspents, wrapper, source)
      yield put(A.fetchUnspentSuccess(data))
    } catch (e) {
      yield put(A.fetchUnspentSuccess([]))
    }
  }

  const publishTransaction = function * ({ type, payload }) {
    const { network, selection, password } = payload
    try {
      const wrapper = yield select(selectors.wallet.getWrapper)
      const signAndPublish = (sel, pass) => taskToPromise(sign(network, pass, wrapper, sel).chain(futurizeP(Task)(api.pushTx)))
      return yield call(signAndPublish, selection, password)
    } catch (e) {
    }
  }

  return function * () {
    yield takeLatest(AT.FETCH_BITCOIN_DATA, fetchData)
    yield takeLatest(AT.FETCH_BITCOIN_FEE, fetchFee)
    yield takeLatest(AT.FETCH_BITCOIN_FIAT_AT_TIME, fetchFiatAtTime)
    yield takeLatest(AT.FETCH_BITCOIN_RATES, fetchRates)
    // yield takeLatest(AT.FETCH_BITCOIN_TRANSACTIONS, fetchTransactions)
    yield fork(watchTransactions)
    yield takeLatest(AT.FETCH_BITCOIN_TRANSACTION_HISTORY, fetchTransactionHistory)
    yield takeLatest(AT.FETCH_BITCOIN_UNSPENT, fetchUnspent)
    yield takeLatest(AT.PUBLISH_BITCOIN_TRANSACTION, publishTransaction)
  }
}
