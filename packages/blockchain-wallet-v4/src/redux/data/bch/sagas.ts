import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'
import * as selectors from '../../selectors'
import * as transactions from '../../../transactions'
import * as walletSelectors from '../../wallet/selectors'
import { addFromToAccountNames } from '../../../utils/accounts'
import { APIType } from 'core/network/api'
import {
  BCH_FORK_TIME,
  convertFromCashAddrIfCashAddr,
  TX_PER_PAGE
} from '../../../utils/bch'
import { BchTxType } from 'core/transactions/types'
import { call, put, select, take } from 'redux-saga/effects'
import { errorHandler, MISSING_WALLET } from '../../../utils'
import { flatten, indexBy, length, map, path, prop } from 'ramda'
import { getAccountsList, getBchTxNotes } from '../../kvStore/bch/selectors'
import { getLockboxBchAccounts } from '../../kvStore/lockbox/selectors'
import { HDAccountList, SBOrderType } from '../../../types'
import moment from 'moment'
import Remote from '../../../remote'
import simpleBuySagas from '../simpleBuy/sagas'

const transformTx = transactions.bch.transformTx

export default ({ api }: { api: APIType }) => {
  const { fetchSBOrders } = simpleBuySagas({ api })

  const fetchData = function * () {
    try {
      yield put(A.fetchDataLoading())
      const context = yield select(S.getContext)
      const data = yield call(api.fetchBchData, context, { n: 1 })
      const bchData = {
        // @ts-ignore
        addresses: indexBy(prop('address'), prop('addresses', data)),
        info: path(['wallet'], data),
        latest_block: path(['info', 'latest_block'], data)
      }
      yield put(A.fetchDataSuccess(bchData))
    } catch (e) {
      yield put(A.fetchDataFailure(errorHandler(e)))
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

  const watchTransactions = function * () {
    while (true) {
      const action = yield take(AT.FETCH_BCH_TRANSACTIONS)
      yield call(fetchTransactions, action)
    }
  }

  const fetchTransactions = function * ({ payload }) {
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
      const txPage: Array<BchTxType> = yield call(__processTxs, filteredTxs)
      const sbPage: Array<SBOrderType> = yield call(
        fetchSBOrders,
        txPage,
        offset,
        atBounds,
        'BCH'
      )
      const page = flatten([txPage, sbPage]).sort((a, b) => {
        return moment(b.insertedAt).valueOf() - moment(a.insertedAt).valueOf()
      })
      yield put(A.fetchTransactionsSuccess(page, reset))
    } catch (e) {
      yield put(A.fetchTransactionsFailure(e.message))
    }
  }

  const __processTxs = function * (txs) {
    // Page == Remote ([Tx])
    // Remote(wallet)
    const wallet = yield select(walletSelectors.getWallet)
    const walletR = Remote.of(wallet)
    const accountList = (yield select(getAccountsList)).getOrElse([])
    const txNotes = (yield select(getBchTxNotes)).getOrElse({})
    const lockboxAccountList = (yield select(getLockboxBchAccounts))
      .map(HDAccountList.fromJS)
      .getOrElse([])

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

  const fetchTransactionHistory = function * ({ payload }) {
    const { address, start, end } = payload
    const startDate = moment(start).format('DD/MM/YYYY')
    const endDate = moment(end).format('DD/MM/YYYY')
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
          startDate,
          endDate
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
          startDate,
          endDate
        )
        yield put(A.fetchTransactionHistorySuccess(data))
      }
    } catch (e) {
      yield put(A.fetchTransactionHistoryFailure(e.message))
    }
  }

  return {
    fetchData,
    fetchRates,
    fetchTransactionHistory,
    fetchTransactions,
    watchTransactions,
    __processTxs
  }
}
