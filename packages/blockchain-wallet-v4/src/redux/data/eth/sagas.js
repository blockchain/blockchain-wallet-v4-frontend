import { call, put, select, take } from 'redux-saga/effects'
import {
  concat,
  dissoc,
  isNil,
  length,
  map,
  mapObjIndexed,
  path,
  prop,
  sum,
  values
} from 'ramda'
import { convertFeeToWei } from '../../../utils/eth'
import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'
import * as selectors from '../../selectors'
import * as kvStoreSelectors from '../../kvStore/eth/selectors'
import { getLockboxEthContext } from '../../kvStore/lockbox/selectors'
import * as transactions from '../../../transactions'

const transformTx = transactions.eth.transformTx

const TX_PER_PAGE = 40
const CONTEXT_FAILURE = 'Could not get ETH context.'

export default ({ api }) => {
  const fetchData = function * () {
    try {
      yield put(A.fetchDataLoading())
      const context = yield select(S.getContext)
      const data = yield call(api.getEthData, context)
      const latestBlock = yield call(api.getEthLatestBlock)
      // account treatments
      const finalBalance = sum(values(data).map(obj => obj.balance))
      const totalReceived = sum(values(data).map(obj => obj.totalReceived))
      const totalSent = sum(values(data).map(obj => obj.totalSent))
      const nTx = sum(values(data).map(obj => obj.txn_count))
      const addresses = mapObjIndexed(num => dissoc('txns', num), data)

      const ethData = {
        addresses,
        info: {
          eth: {
            n_tx: nTx,
            total_received: totalReceived,
            total_sent: totalSent,
            final_balance: finalBalance
          }
        },
        latest_block: latestBlock
      }
      yield put(A.fetchDataSuccess(ethData))
    } catch (e) {
      yield put(A.fetchDataFailure(e.message))
    }
  }

  const fetchFee = function * () {
    try {
      yield put(A.fetchFeeLoading())
      const data = yield call(api.getEthFee)
      const weiData = convertFeeToWei(data)
      yield put(A.fetchFeeSuccess(weiData))
    } catch (e) {
      yield put(A.fetchFeeFailure(e.message))
    }
  }

  const fetchLatestBlock = function * () {
    try {
      yield put(A.fetchLatestBlockLoading())
      const data = yield call(api.getEthLatestBlock)
      yield put(A.fetchLatestBlockSuccess(data))
    } catch (e) {
      yield put(A.fetchLatestBlockFailure(e.message))
    }
  }

  const fetchRates = function * () {
    try {
      yield put(A.fetchRatesLoading())
      const data = yield call(api.getEthTicker)
      yield put(A.fetchRatesSuccess(data))
    } catch (e) {
      yield put(A.fetchRatesFailure(e.message))
    }
  }

  const watchTransactions = function * () {
    while (true) {
      const action = yield take(AT.FETCH_ETH_TRANSACTIONS)
      yield call(fetchTransactions, action)
    }
  }

  const fetchTransactions = function * (action) {
    try {
      const { payload } = action
      const { address, reset } = payload
      const defaultAccountR = yield select(selectors.kvStore.eth.getContext)
      const ethAddress = address || defaultAccountR.getOrFail(CONTEXT_FAILURE)
      const pages = yield select(S.getTransactions)
      const nextPage = reset ? 0 : length(pages)
      const transactionsAtBound = yield select(S.getTransactionsAtBound)
      if (transactionsAtBound && !reset) return
      yield put(A.fetchTransactionsLoading(reset))
      const data = yield call(api.getEthTransactions, ethAddress, nextPage)
      const txs = path([ethAddress, 'txns'], data)
      if (isNil(txs)) return
      const atBounds = length(txs) < TX_PER_PAGE
      yield put(A.transactionsAtBound(atBounds))
      const page = yield call(__processTxs, txs)
      yield put(A.fetchTransactionsSuccess(page, reset))
    } catch (e) {
      yield put(A.fetchTransactionsFailure(e.message))
    }
  }

  const __processTxs = function * (txs) {
    const accountsR = yield select(kvStoreSelectors.getAccounts)
    const addresses = accountsR.getOrElse([]).map(prop('addr'))
    const lockboxContextR = yield select(getLockboxEthContext)
    const lockboxContext = lockboxContextR.getOrElse([])
    const state = yield select()
    const ethAddresses = concat(addresses, lockboxContext)
    return map(transformTx(ethAddresses, state), txs)
  }

  const fetchLegacyBalance = function * () {
    try {
      yield put(A.fetchLegacyBalanceLoading())
      const addrR = yield select(kvStoreSelectors.getLegacyAccountAddress)
      const addr = addrR.getOrElse('')
      const balances = yield call(api.getEthBalances, addr)
      const balance = path([addr, 'balance'], balances)
      yield put(A.fetchLegacyBalanceSuccess(balance))
    } catch (e) {
      yield put(A.fetchLegacyBalanceFailure())
    }
  }
  return {
    fetchData,
    fetchFee,
    fetchLegacyBalance,
    fetchRates,
    fetchLatestBlock,
    fetchTransactions,
    watchTransactions,
    __processTxs
  }
}
