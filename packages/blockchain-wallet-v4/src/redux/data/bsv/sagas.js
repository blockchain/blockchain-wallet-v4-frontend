import { call, put, select, take } from 'redux-saga/effects'
import { indexBy, length, map, path, prop } from 'ramda'
import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'
import {
  TX_PER_PAGE,
  BSV_FORK_TIME,
  convertFromCashAddrIfCashAddr
} from '../../../utils/bsv'
import { MISSING_WALLET } from '../utils'
import { addFromToAccountNames } from '../../../utils/accounts'
import Remote from '../../../remote'
import * as walletSelectors from '../../wallet/selectors'
import * as transactions from '../../../transactions'
import { getAccountsList, getBsvTxNotes } from '../../kvStore/bsv/selectors'

const transformTx = transactions.bsv.transformTx

export default ({ api }) => {
  const fetchData = function*() {
    try {
      yield put(A.fetchDataLoading())
      const context = yield select(S.getContext)
      const data = yield call(api.fetchBsvData, context, { n: 1 })
      const bsvData = {
        addresses: indexBy(prop('address'), prop('addresses', data)),
        info: path(['wallet'], data),
        latest_block: path(['info', 'latest_block'], data)
      }
      yield put(A.fetchDataSuccess(bsvData))
    } catch (e) {
      yield put(A.fetchDataFailure(e.message))
    }
  }

  const fetchFee = function*() {
    try {
      yield put(A.fetchFeeLoading())
      const data = yield call(api.getBsvFee)
      yield put(A.fetchFeeSuccess(data))
    } catch (e) {
      yield put(A.fetchFeeFailure(e.message))
    }
  }

  const fetchRates = function*() {
    try {
      yield put(A.fetchRatesLoading())
      const data = yield call(api.getBsvTicker)
      yield put(A.fetchRatesSuccess(data))
    } catch (e) {
      yield put(A.fetchRatesFailure(e.message))
    }
  }

  const watchTransactions = function*() {
    while (true) {
      const action = yield take(AT.FETCH_BSV_TRANSACTIONS)
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
      const context = yield select(S.getContext)
      const convertedAddress = convertFromCashAddrIfCashAddr(address)
      const data = yield call(api.fetchBsvData, context, {
        n: TX_PER_PAGE,
        onlyShow: convertedAddress || null,
        offset
      })
      const filteredTxs = data.txs.filter(tx => tx.time > BSV_FORK_TIME)
      const atBounds = length(filteredTxs) < TX_PER_PAGE
      yield put(A.transactionsAtBound(atBounds))
      const page = yield call(__processTxs, filteredTxs)
      yield put(A.fetchTransactionsSuccess(page, reset))
    } catch (e) {
      yield put(A.fetchTransactionsFailure(e.message))
    }
  }

  const __processTxs = function*(txs) {
    // Page == Remote ([Tx])
    // Remote(wallet)
    const wallet = yield select(walletSelectors.getWallet)
    const walletR = Remote.of(wallet)
    // Remote(kvStoreAccountList)
    const accountList = (yield select(getAccountsList)).getOrElse([])
    const txNotes = (yield select(getBsvTxNotes)).getOrElse({})
    // Remote(lockboxXpubs)
    const lockboxAccountList = []

    // transformTx :: wallet -> Tx
    // ProcessPage :: wallet -> [Tx] -> [Tx]
    const ProcessTxs = (wallet, lockboxAccountList, txList, txNotes) =>
      map(
        transformTx.bind(
          undefined,
          wallet.getOrFail(MISSING_WALLET),
          lockboxAccountList,
          txNotes
        ),
        txList
      )
    // ProcessRemotePage :: Page -> Page
    const processedTxs = ProcessTxs(walletR, lockboxAccountList, txs, txNotes)
    return addFromToAccountNames(wallet, accountList, processedTxs)
  }

  return {
    fetchData,
    fetchFee,
    fetchRates,
    fetchTransactions,
    watchTransactions,
    __processTxs
  }
}
