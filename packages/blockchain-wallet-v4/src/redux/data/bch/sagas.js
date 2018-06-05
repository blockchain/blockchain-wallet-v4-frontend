import { call, fork, put, select, take } from 'redux-saga/effects'
import { indexBy, length, path, prop, last } from 'ramda'
import * as AT from './actionTypes'
import * as A from './actions'
import * as S from './selectors'
import * as selectors from '../../selectors'

export default ({ api }) => {
  const fetchFee = function * () {
    try {
      yield put(A.fetchFeeLoading())
      const data = yield call(api.getBchFee)
      yield put(A.fetchFeeSuccess(data))
    } catch (e) {
      yield put(A.fetchFeeFailure(e.message))
    }
  }

  const fetchRates = function * () {
    try {
      yield put(A.fetchRatesLoading())
      const data = yield call(api.getBchTicker)
      yield put(A.fetchRatesSuccess(data))
    } catch (e) {
      yield put(A.fetchRatesFailure(e.message))
    }
  }

  const fetchData = function * ({ payload }) {
    const { address, reset } = payload
    const TX_PER_PAGE = 10
    const BCH_FORK_TIME = 1501590000
    try {
      const pages = yield select(S.getTransactions)
      const lastPage = last(pages)
      if (!reset && lastPage && lastPage.map(length).getOrElse(0) === 0) { return }
      const offset = reset ? 0 : length(pages) * TX_PER_PAGE
      yield put(A.fetchTransactionsLoading(reset))
      const context = yield select(selectors.kvStore.bch.getContext)
      const data = yield call(api.fetchBchData, context, { n: TX_PER_PAGE, onlyShow: address, offset })
      yield call(multiaddrSaga, data)
      yield fork(fetchSpendableBalance)
      yield fork(fetchUnspendableBalance)
      yield put(A.fetchTransactionsSuccess(data.txs.filter(tx => tx.time > BCH_FORK_TIME), reset))
    } catch (e) {
      yield put(A.fetchTransactionsFailure(e.message))
    }
  }

  const fetchTransactionHistory = function * ({ payload }) {
    const { address, start, end } = payload
    try {
      yield put(A.fetchTransactionHistoryLoading())
      const currency = yield select(selectors.settings.getCurrency)
      if (address) {
        const data = yield call(api.getTransactionHistory, 'BCH', address, currency.getOrElse('USD'), start, end)
        yield put(A.fetchTransactionHistorySuccess(data))
      } else {
        const context = yield select(selectors.wallet.getWalletContext)
        const active = context.join('|')
        const data = yield call(api.getTransactionHistory, 'BCH', active, currency.getOrElse('USD'), start, end)
        yield put(A.fetchTransactionHistorySuccess(data))
      }
    } catch (e) {
      yield put(A.fetchTransactionHistoryFailure(e.message))
    }
  }

  const fetchUnspent = function * (action) {
    try {
      // source can be the hd account index / or a legacy address
      const { source } = action.payload
      yield put(A.fetchUnspentLoading())
      const wrapper = yield select(selectors.wallet.getWrapper)
      const data = yield call(api.getBCHWalletUnspents, wrapper, source)
      yield put(A.fetchUnspentSuccess(data))
    } catch (e) {
      yield put(A.fetchUnspentSuccess([]))
    }
  }

  const fetchSpendableBalance = function * (action) {
    try {
      const context = yield select(selectors.kvStore.bch.getSpendableContext)
      yield put(A.fetchSpendableBalanceLoading())
      const data = yield call(api.fetchBchData, context)
      const balance = data.wallet ? data.wallet.final_balance : 0
      yield put(A.fetchSpendableBalanceSuccess(balance))
    } catch (e) {
      yield put(A.fetchSpendableBalanceFailure(e))
    }
  }

  const fetchUnspendableBalance = function * (action) {
    try {
      const context = yield select(selectors.kvStore.bch.getUnspendableContext)
      yield put(A.fetchUnspendableBalanceLoading())
      const data = yield call(api.fetchBchData, context)
      const balance = data.wallet ? data.wallet.final_balance : 0
      yield put(A.fetchUnspendableBalanceSuccess(balance))
    } catch (e) {
      yield put(A.fetchUnspendableBalanceFailure(e))
    }
  }

  const multiaddrSaga = function * (data) {
    const bchData = {
      addresses: indexBy(prop('address'), prop('addresses', data)),
      info: path(['wallet'], data),
      latest_block: path(['info', 'latest_block'], data)
    }
    yield put(A.fetchDataSuccess(bchData))
  }

  return {
    fetchFee,
    fetchData,
    fetchRates,
    fetchUnspent,
    fetchSpendableBalance,
    fetchUnspendableBalance,
    fetchTransactionHistory
  }
}
