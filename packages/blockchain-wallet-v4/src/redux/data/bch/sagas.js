import { call, put, select, take } from 'redux-saga/effects'
import { indexBy, length, path, prop } from 'ramda'
import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'
import * as selectors from '../../selectors'
import {
  convertFromCashAddrIfCashAddr,
  TX_PER_PAGE,
  BCH_FORK_TIME
} from '../../../utils/bch'

export default ({ api }) => {
  const fetchData = function*() {
    try {
      yield put(A.fetchDataLoading())
      const context = yield select(S.getContext)
      const data = yield call(api.fetchBchData, context, { n: 1 })
      const bchData = {
        addresses: indexBy(prop('address'), prop('addresses', data)),
        info: path(['wallet'], data),
        latest_block: path(['info', 'latest_block'], data)
      }
      yield put(A.fetchDataSuccess(bchData))
    } catch (e) {
      yield put(A.fetchDataFailure(e.message))
    }
  }

  const fetchFee = function*() {
    try {
      yield put(A.fetchFeeLoading())
      const data = yield call(api.getBchFee)
      yield put(A.fetchFeeSuccess(data))
    } catch (e) {
      yield put(A.fetchFeeFailure(e.message))
    }
  }

  const fetchRates = function*() {
    try {
      yield put(A.fetchRatesLoading())
      const data = yield call(api.getBchTicker)
      yield put(A.fetchRatesSuccess(data))
    } catch (e) {
      yield put(A.fetchRatesFailure(e.message))
    }
  }

  const watchTransactions = function*() {
    while (true) {
      const action = yield take(AT.FETCH_BCH_TRANSACTIONS)
      yield call(fetchTransactions, action)
    }
  }

  const fetchTransactions = function*({ type, payload }) {
    const { address, reset } = payload
    try {
      const pages = yield select(S.getTransactions)
      const offset = reset ? 0 : length(pages) * TX_PER_PAGE
      const transactionsAtBound = yield select(S.getTransactionsAtBound)
      if (transactionsAtBound && !reset) return
      yield put(A.fetchTransactionsLoading(reset))
      const walletContext = yield select(S.getWalletContext)
      const context = yield select(S.getContext)
      const convertedAddress = convertFromCashAddrIfCashAddr(address)
      const data = yield call(api.fetchBchData, context, {
        n: TX_PER_PAGE,
        onlyShow: convertedAddress || walletContext.join('|'),
        offset
      })
      const filteredTxs = data.txs.filter(tx => tx.time > BCH_FORK_TIME)
      const atBounds = length(filteredTxs) < TX_PER_PAGE
      yield put(A.transactionsAtBound(atBounds))
      yield put(A.fetchTransactionsSuccess(filteredTxs, reset))
    } catch (e) {
      yield put(A.fetchTransactionsFailure(e.message))
    }
  }

  const fetchTransactionHistory = function*({ payload }) {
    const { address, start, end } = payload
    try {
      yield put(A.fetchTransactionHistoryLoading())
      const currency = yield select(selectors.settings.getCurrency)
      if (address) {
        const convertedAddress = convertFromCashAddrIfCashAddr(address)
        const data = yield call(
          api.getTransactionHistory,
          'BCH',
          convertedAddress,
          currency.getOrElse('USD'),
          start,
          end
        )
        yield put(A.fetchTransactionHistorySuccess(data))
      } else {
        const context = yield select(S.getContext)
        const active = context.join('|')
        const data = yield call(
          api.getTransactionHistory,
          'BCH',
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

  return {
    fetchData,
    fetchFee,
    fetchRates,
    fetchTransactionHistory,
    fetchTransactions,
    watchTransactions
  }
}
