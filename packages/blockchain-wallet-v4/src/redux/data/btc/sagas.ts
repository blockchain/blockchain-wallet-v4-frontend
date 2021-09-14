import moment from 'moment'
import { concat, flatten, indexBy, length, map, path, prop, replace } from 'ramda'
import { call, put, select, take } from 'redux-saga/effects'

import {
  FetchCustodialOrdersAndTransactionsReturnType,
  HDAccountList,
  Wallet
} from 'blockchain-wallet-v4/src/types'
import { APIType } from 'core/network/api'
import { ProcessedTxType } from 'core/transactions/types'

import Remote from '../../../remote'
import * as transactions from '../../../transactions'
import { errorHandler, MISSING_WALLET } from '../../../utils'
import { getAddressLabels } from '../../kvStore/btc/selectors'
import * as selectors from '../../selectors'
import * as walletSelectors from '../../wallet/selectors'
import custodialSagas from '../custodial/sagas'
import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'

const { transformTx } = transactions.btc
const TX_PER_PAGE = 10

export default ({ api }: { api: APIType }) => {
  const { fetchCustodialOrdersAndTransactions } = custodialSagas({ api })

  const fetchData = function* () {
    try {
      yield put(A.fetchDataLoading())
      const context = yield select(S.getContext)
      const data = yield call(api.fetchBlockchainData, context, { n: 1 })
      const btcData = {
        // @ts-ignore
        addresses: indexBy(prop('address'), prop('addresses', data)),
        info: path(['wallet'], data),
        latest_block: path(['info', 'latest_block'], data)
      }
      yield put(A.fetchDataSuccess(btcData))
    } catch (e) {
      yield put(A.fetchDataFailure(errorHandler(e)))
    }
  }

  const watchTransactions = function* () {
    while (true) {
      const action = yield take(AT.FETCH_BTC_TRANSACTIONS)
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
      const context = yield select(S.getContext)
      const walletContext = yield select(S.getWalletContext)
      const data = yield call(
        api.fetchBlockchainData,
        context,
        {
          n: TX_PER_PAGE,
          offset,
          onlyShow: address || concat(walletContext.legacy, walletContext.bech32 || [])
        },
        filter
      )
      const atBounds = length(data.txs) < TX_PER_PAGE
      yield put(A.transactionsAtBound(atBounds))
      const txPage: Array<ProcessedTxType> = yield call(__processTxs, data.txs)
      const nextSBTransactionsURL = selectors.data.custodial.getNextSBTransactionsURL(
        yield select(),
        'BTC'
      )
      const custodialPage: FetchCustodialOrdersAndTransactionsReturnType = yield call(
        fetchCustodialOrdersAndTransactions,
        txPage,
        offset,
        atBounds,
        'BTC',
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

  const fetchTransactionHistory = function* ({ payload }) {
    const { address, end, start } = payload
    const bech32Address = address.find((add) => prop('type', add) === 'bech32')
    const legacyAddress = address.find((add) => prop('type', add) === 'legacy')
    const startDate = moment(start).format('DD/MM/YYYY')
    const endDate = moment(end).format('DD/MM/YYYY')
    try {
      yield put(A.fetchTransactionHistoryLoading())
      const currency = yield select(selectors.settings.getCurrency)
      if (address) {
        const data = yield call(
          api.getBtcTransactionHistory,
          prop('address', legacyAddress),
          prop('address', bech32Address),
          currency.getOrElse('USD'),
          startDate,
          endDate
        )
        yield put(A.fetchTransactionHistorySuccess(data))
      } else {
        const context = yield select(S.getContext)
        const active = context.join('|')
        const data = yield call(
          api.getBtcTransactionHistory,
          active,
          undefined,
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

  const __processTxs = function* (txs) {
    // Page == Remote ([Tx])
    // Remote(wallet)
    const wallet = yield select(walletSelectors.getWallet)
    const walletR = Remote.of(wallet)
    const addressLabels = (yield select(getAddressLabels)).getOrElse({})
    const txNotes = Wallet.selectTxNotes(wallet)

    // transformTx :: wallet -> Tx
    // ProcessPage :: wallet -> [Tx] -> [Tx]
    const ProcessTxs = (wallet, txList, txNotes, addressLabels) =>
      map(
        transformTx.bind(undefined, wallet.getOrFail(MISSING_WALLET), txNotes, addressLabels),
        txList
      )
    // ProcessRemotePage :: Page -> Page
    return ProcessTxs(walletR, txs, txNotes, addressLabels)
  }

  const fetchFiatAtTime = function* (action) {
    const { amount, currency, hash, time } = action.payload
    try {
      yield put(A.fetchFiatAtTimeLoading(hash, currency))
      const data = yield call(api.getBtcFiatAtTime, amount, currency, time)
      let parsedData
      try {
        parsedData = parseFloat(replace(/,/g, '', data))
      } catch (e) {
        parsedData = data
      }
      yield put(A.fetchFiatAtTimeSuccess(hash, currency, parsedData))
    } catch (e) {
      yield put(A.fetchFiatAtTimeFailure(hash, currency, e.message))
    }
  }

  return {
    __processTxs,
    fetchData,
    fetchFiatAtTime,
    fetchTransactionHistory,
    fetchTransactions,
    watchTransactions
  }
}
