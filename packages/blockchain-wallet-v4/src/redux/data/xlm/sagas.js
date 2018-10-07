import { call, put, select, take } from 'redux-saga/effects'
import { dissoc, isNil, length, mapObjIndexed, path, sum, values } from 'ramda'
import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'
import * as selectors from '../../selectors'

export default ({ api }) => {
  const fetchData = function*(action) {
    try {
      yield put(A.fetchDataLoading())
      const context = yield select(S.getContext)
      const data = yield call(api.getXlmData, context)
      // Accounts treatments

      const finalBalance = sum(values(data).map(obj => obj.balance))
      const totalReceived = sum(values(data).map(obj => obj.totalReceived))
      const totalSent = sum(values(data).map(obj => obj.totalSent))
      const nTx = sum(values(data).map(obj => obj.txn_count))
      const addresses = mapObjIndexed(
        (num, key, obj) => dissoc('txns', num),
        data
      )

      const xlmData = {
        addresses,
        info: {
          n_tx: nTx,
          total_received: totalReceived,
          total_sent: totalSent,
          final_balance: finalBalance
        }
        // latest_block: latestBlock
      }
      yield put(A.fetchDataSuccess(xlmData))
    } catch (e) {
      yield put(A.fetchDataFailure(e.message))
    }
  }

  const fetchRates = function*() {
    try {
      yield put(A.fetchRatesLoading())
      // TODO: XLM: replace with getXlmTicker
      const data = yield call(api.getBitcoinTicker)
      yield put(A.fetchRatesSuccess(data))
    } catch (e) {
      yield put(A.fetchRatesFailure(e.message))
    }
  }

  const watchTransactions = function*() {
    while (true) {
      const action = yield take(AT.FETCH_XLM_TRANSACTIONS)
      yield call(fetchTransactions, action)
    }
  }

  const fetchTransactions = function*(action) {
    try {
      const { payload } = action
      const { address, reset } = payload
      const defaultAccountR = yield select(
        selectors.kvStore.xlm.getDefaultAccountId
      )
      const xlmAddress =
        address || defaultAccountR.getOrFail('Could not get xlm context.')
      const pages = yield select(S.getTransactions)
      const nextPage = reset ? 0 : length(pages)
      yield put(A.fetchTransactionsLoading(reset))
      const data = yield call(api.getXlmTransactions, xlmAddress, nextPage)
      const txs = path([xlmAddress, 'txns'], data)
      if (isNil(txs)) return
      yield put(A.fetchTransactionsSuccess(txs, reset))
    } catch (e) {
      yield put(A.fetchTransactionsFailure(e.message))
    }
  }

  return {
    fetchData,
    fetchRates,
    fetchTransactions,
    watchTransactions
  }
}
