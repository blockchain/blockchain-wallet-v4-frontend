import moment from 'moment'
import { flatten, indexBy, length, map, path, prop } from 'ramda'
import { call, put, select, take } from 'redux-saga/effects'

import {
  FetchCustodialOrdersAndTransactionsReturnType,
  HDAccountList
} from 'blockchain-wallet-v4/src/types'
import { APIType } from 'core/network/api'
import { BchTxType } from 'core/transactions/types'

import Remote from '../../../remote'
import * as transactions from '../../../transactions'
import { errorHandler, MISSING_WALLET } from '../../../utils'
import { addFromToAccountNames } from '../../../utils/accounts'
import { BCH_FORK_TIME, convertFromCashAddrIfCashAddr, TX_PER_PAGE } from '../../../utils/bch'
import { getAccountsList, getBchTxNotes } from '../../kvStore/bch/selectors'
import * as selectors from '../../selectors'
import * as walletSelectors from '../../wallet/selectors'
import custodialSagas from '../custodial/sagas'
import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'

const { transformTx } = transactions.bch

export default ({ api }: { api: APIType }) => {
  const { fetchCustodialOrdersAndTransactions } = custodialSagas({ api })

  const fetchData = function* () {
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

  const watchTransactions = function* () {
    while (true) {
      const action = yield take(AT.FETCH_BCH_TRANSACTIONS)
      yield call(fetchTransactions, action)
    }
  }

  const fetchTransactions = function* (action) {
    try {
      const { payload } = action
      const { address, filter, reset } = payload
      const pages = yield select(S.getTransactions)
      const offset = reset ? 0 : length(pages) * TX_PER_PAGE
      const transactionsAtBound = yield select(S.getTransactionsAtBound)
      if (transactionsAtBound && !reset) return
      yield put(A.fetchTransactionsLoading(reset))
      const walletContext = yield select(S.getWalletContext)
      const context = yield select(S.getContext)
      const convertedAddress = convertFromCashAddrIfCashAddr(address)
      const data = yield call(
        api.fetchBchData,
        context,
        {
          n: TX_PER_PAGE,
          offset,
          onlyShow: convertedAddress || walletContext.join('|')
        },
        filter
      )
      const filteredTxs = data.txs.filter((tx) => tx.time > BCH_FORK_TIME)
      const atBounds = length(filteredTxs) < TX_PER_PAGE
      yield put(A.transactionsAtBound(atBounds))
      const txPage: Array<BchTxType> = yield call(__processTxs, filteredTxs)
      const nextSBTransactionsURL = selectors.data.custodial.getNextSBTransactionsURL(
        yield select(),
        'BCH'
      )
      const custodialPage: FetchCustodialOrdersAndTransactionsReturnType = yield call(
        fetchCustodialOrdersAndTransactions,
        txPage,
        offset,
        atBounds,
        'BCH',
        reset ? null : nextSBTransactionsURL
      )
      const page = flatten([txPage, custodialPage.orders]).sort((a, b) => {
        return moment(b.insertedAt).valueOf() - moment(a.insertedAt).valueOf()
      })
      yield put(A.fetchTransactionsSuccess(page, reset))
    } catch (e) {
      yield put(A.fetchTransactionsFailure(e.message))
    }
  }

  const __processTxs = function* (txs) {
    // Page == Remote ([Tx])
    // Remote(wallet)
    const wallet = yield select(walletSelectors.getWallet)
    const walletR = Remote.of(wallet)
    const accountList = (yield select(getAccountsList)).getOrElse([])
    const txNotes = (yield select(getBchTxNotes)).getOrElse({})

    // transformTx :: wallet -> Tx
    // ProcessPage :: wallet -> [Tx] -> [Tx]
    const ProcessTxs = (wallet, txList, txNotes) =>
      map(
        transformTx.bind(undefined, wallet.getOrFail(MISSING_WALLET), txNotes),
        txList
      )
    // ProcessRemotePage :: Page -> Page
    const processedTxs = ProcessTxs(walletR, txs, txNotes)
    return addFromToAccountNames(wallet, accountList, processedTxs)
  }

  const fetchTransactionHistory = function* ({ payload }) {
    const { address, end, start } = payload
    const startDate = moment(start).format('DD/MM/YYYY')
    const endDate = moment(end).format('DD/MM/YYYY')
    try {
      yield put(A.fetchTransactionHistoryLoading())
      const currency = yield select(selectors.settings.getCurrency)
      if (address) {
        const bchLegacyAddress = prop(
          'address',
          address.find((add) => add.type === 'legacy')
        )
        const convertedAddress = convertFromCashAddrIfCashAddr(bchLegacyAddress)
        const data = yield call(
          api.getBchTransactionHistory,
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
          api.getBchTransactionHistory,
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
    __processTxs,
    fetchData,
    fetchTransactionHistory,
    fetchTransactions,
    watchTransactions
  }
}
