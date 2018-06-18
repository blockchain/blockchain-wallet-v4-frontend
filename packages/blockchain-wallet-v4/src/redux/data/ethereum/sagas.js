import { call, put, select, take } from 'redux-saga/effects'
import { dissoc, isNil, length, mapObjIndexed, path, sum, values } from 'ramda'
import { convertFeeToWei } from '../../../utils/ethereum'
import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'
import * as selectors from '../../selectors'
import * as kvStoreSelectors from '../../kvStore/ethereum/selectors'

export default ({ api }) => {
  const fetchData = function * (action) {
    try {
      yield put(A.fetchDataLoading())
      const contextR = yield select(kvStoreSelectors.getContext)
      const context = contextR.getOrFail('ethereum_context')
      const data = yield call(api.getEthereumData, context)
      const latestBlock = yield call(api.getEthereumLatestBlock)
      // Accounts treatments
      const finalBalance = sum(values(data).map(obj => obj.balance))
      const totalReceived = sum(values(data).map(obj => obj.totalReceived))
      const totalSent = sum(values(data).map(obj => obj.totalSent))
      const nTx = sum(values(data).map(obj => obj.txn_count))
      const addresses = mapObjIndexed((num, key, obj) => dissoc('txns', num), data)

      const ethereumData = {
        addresses,
        info: {
          n_tx: nTx,
          total_received: totalReceived,
          total_sent: totalSent,
          final_balance: finalBalance
        },
        latest_block: latestBlock
      }
      yield put(A.fetchDataSuccess(ethereumData))
    } catch (e) {
      yield put(A.fetchDataFailure(e.message))
    }
  }

  const fetchFee = function * () {
    try {
      yield put(A.fetchFeeLoading())
      const data = yield call(api.getEthereumFee)
      const weiData = convertFeeToWei(data)
      yield put(A.fetchFeeSuccess(weiData))
    } catch (e) {
      yield put(A.fetchFeeFailure(e.message))
    }
  }

  const fetchLatestBlock = function * () {
    try {
      yield put(A.fetchLatestBlockLoading())
      const data = yield call(api.getEthereumLatestBlock)
      yield put(A.fetchLatestBlockSuccess(data))
    } catch (e) {
      yield put(A.fetchLatestBlockFailure(e.message))
    }
  }

  const fetchRates = function * () {
    try {
      yield put(A.fetchRatesLoading())
      const data = yield call(api.getEthereumTicker)
      yield put(A.fetchRatesSuccess(data))
    } catch (e) {
      yield put(A.fetchRatesFailure(e.message))
    }
  }

  const watchTransactions = function * () {
    while (true) {
      const action = yield take(AT.FETCH_ETHEREUM_TRANSACTIONS)
      yield call(fetchTransactions, action)
    }
  }

  const fetchTransactions = function * ({ type, payload }) {
    try {
      const defaultAccountR = yield select(selectors.kvStore.ethereum.getContext)
      const address = defaultAccountR.getOrFail('Could not get ethereum context.')
      const pages = yield select(S.getTransactions)
      const nextPage = length(pages)
      yield put(A.fetchTransactionsLoading())
      const data = yield call(api.getEthereumTransactions, address, nextPage)
      const txs = path([address, 'txns'], data)
      if (isNil(txs)) return
      yield put(A.fetchTransactionsSuccess(txs))
    } catch (e) {
      yield put(A.fetchTransactionsFailure(e.message))
    }
  }

  const fetchLegacyBalance = function * () {
    try {
      yield put(A.fetchLegacyBalanceLoading())
      const addrR = yield select(kvStoreSelectors.getLegacyAccountAddress)
      const addr = addrR.getOrElse('')
      const balances = yield call(api.getEthereumBalances, addr)
      const balance = path([addr, 'balance'], balances)
      yield put(A.fetchLegacyBalanceSuccess(balance))
    } catch (e) {
      yield put(A.fetchLegacyBalanceFailure())
    }
  }
  return {
    fetchFee,
    fetchData,
    fetchLegacyBalance,
    fetchRates,
    fetchLatestBlock,
    watchTransactions
  }
}
