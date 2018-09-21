import { call, put, select, take } from 'redux-saga/effects'
import { indexBy, length, last, path, prop } from 'ramda'
import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'
import * as selectors from '../../selectors'

export default ({ api }) => {
  const fetchData = function*() {
    try {
      yield put(A.fetchDataLoading())
      const context = yield select(selectors.wallet.getContext)
      const data = yield call(api.fetchBlockchainData, context, { n: 1 })
      const bitcoinData = {
        addresses: indexBy(prop('address'), prop('addresses', data)),
        info: path(['wallet'], data),
        latest_block: path(['info', 'latest_block'], data)
      }
      yield put(A.fetchDataSuccess(bitcoinData))
    } catch (e) {
      if (prop('message', e)) yield put(A.fetchDataFailure(e.message))
      else yield put(A.fetchDataFailure(e))
    }
  }

  const fetchFee = function*() {
    try {
      yield put(A.fetchFeeLoading())
      const data = yield call(api.getBitcoinFee)
      yield put(A.fetchFeeSuccess(data))
    } catch (e) {
      yield put(A.fetchFeeFailure(e.message))
    }
  }

  const fetchRates = function*() {
    try {
      yield put(A.fetchRatesLoading())
      const data = yield call(api.getBitcoinTicker)
      yield put(A.fetchRatesSuccess(data))
    } catch (e) {
      yield put(A.fetchRatesFailure(e.message))
    }
  }

  const watchTransactions = function*() {
    while (true) {
      const action = yield take(AT.FETCH_BITCOIN_TRANSACTIONS)
      yield call(fetchTransactions, action)
    }
  }

  const fetchTransactions = function*(action) {
    try {
      const { payload } = action
      const { address, reset } = payload
      const TX_PER_PAGE = 10
      const pages = yield select(S.getTransactions)
      const lastPage = last(pages)
      if (!reset && lastPage && lastPage.map(length).getOrElse(0) === 0) {
        return
      }
      const offset = reset ? 0 : length(pages) * TX_PER_PAGE
      yield put(A.fetchTransactionsLoading(reset))
      const context = yield select(selectors.wallet.getWalletContext)
      const data = yield call(api.fetchBlockchainData, context, {
        n: TX_PER_PAGE,
        onlyShow: address,
        offset
      })
      yield put(A.fetchTransactionsSuccess(data.txs, reset))
    } catch (e) {
      yield put(A.fetchTransactionsFailure(e.message))
    }
  }

  const fetchTransactionHistory = function*({ type, payload }) {
    const { address, start, end } = payload
    try {
      yield put(A.fetchTransactionHistoryLoading())
      const currency = yield select(selectors.settings.getCurrency)
      if (address) {
        const data = yield call(
          api.getTransactionHistory,
          'BTC',
          address,
          currency.getOrElse('USD'),
          start,
          end
        )
        yield put(A.fetchTransactionHistorySuccess(data))
      } else {
        const context = yield select(selectors.wallet.getWalletContext)
        const active = context.join('|')
        const data = yield call(
          api.getTransactionHistory,
          'BTC',
          active,
          currency.getOrElse('USD'),
          start,
          end
        )
        yield put(A.fetchTransactionHistorySuccess(data))
      }
    } catch (e) {
      yield put(A.fetchTransactionHistoryFailure(e.message))
    }
  }

  const fetchFiatAtTime = function*(action) {
    const { hash, amount, time, currency } = action.payload
    try {
      yield put(A.fetchFiatAtTimeLoading(hash, currency))
      const data = yield call(api.getBitcoinFiatAtTime, amount, currency, time)
      yield put(A.fetchFiatAtTimeSuccess(hash, currency, data))
    } catch (e) {
      yield put(A.fetchFiatAtTimeFailure(hash, currency, e.message))
    }
  }

  return {
    fetchData,
    fetchFee,
    fetchRates,
    fetchFiatAtTime,
    fetchTransactionHistory,
    fetchTransactions,
    watchTransactions
  }
}
