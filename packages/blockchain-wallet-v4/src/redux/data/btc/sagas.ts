import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'
import * as selectors from '../../selectors'
import * as transactions from '../../../transactions'
import * as walletSelectors from '../../wallet/selectors'
import { APIType } from 'core/network/api'
import { call, put, select, take } from 'redux-saga/effects'
import { errorHandler, MISSING_WALLET } from '../../../utils'
import { flatten, indexBy, length, map, path, prop, replace } from 'ramda'
import { getAddressLabels } from '../../kvStore/btc/selectors'
import { getLockboxBtcAccounts } from '../../kvStore/lockbox/selectors'
import { HDAccountList, SBOrderType, Wallet } from '../../../types'
import { ProcessedTxType } from 'core/transactions/types'
import moment from 'moment'
import Remote from '../../../remote'
import simpleBuySagas from '../simpleBuy/sagas'

const transformTx = transactions.btc.transformTx
const TX_PER_PAGE = 10

export default ({ api }: { api: APIType }) => {
  const { fetchSBOrders } = simpleBuySagas({ api })

  const fetchData = function * () {
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

  const fetchRates = function * () {
    try {
      yield put(A.fetchRatesLoading())
      const data = yield call(api.getBtcTicker)
      yield put(A.fetchRatesSuccess(data))
    } catch (e) {
      yield put(A.fetchRatesFailure(e.message))
    }
  }

  const watchTransactions = function * () {
    while (true) {
      const action = yield take(AT.FETCH_BTC_TRANSACTIONS)
      yield call(fetchTransactions, action)
    }
  }

  const fetchTransactions = function * (action) {
    try {
      const { payload } = action
      const { address, reset } = payload
      const pages = yield select(S.getTransactions)
      const offset = reset ? 0 : length(pages) * TX_PER_PAGE
      const transactionsAtBound = yield select(S.getTransactionsAtBound)
      if (transactionsAtBound && !reset) return
      yield put(A.fetchTransactionsLoading(reset))
      const walletContext = yield select(selectors.wallet.getWalletContext)
      const context = yield select(S.getContext)
      const data = yield call(api.fetchBlockchainData, context, {
        n: TX_PER_PAGE,
        onlyShow: address || walletContext,
        offset
      })
      const atBounds = length(data.txs) < TX_PER_PAGE
      yield put(A.transactionsAtBound(atBounds))
      const txPage: Array<ProcessedTxType> = yield call(__processTxs, data.txs)
      const sbPage: Array<SBOrderType> = yield call(
        fetchSBOrders,
        txPage,
        offset,
        atBounds,
        'BTC'
      )
      const page = flatten([txPage, sbPage]).sort((a, b) => {
        return moment(b.insertedAt).valueOf() - moment(a.insertedAt).valueOf()
      })
      yield put(A.fetchTransactionsSuccess(page, reset))
    } catch (e) {
      yield put(A.fetchTransactionsFailure(e.message))
    }
  }

  const fetchTransactionHistory = function * ({ payload }) {
    const { address, start, end } = payload
    const startDate = moment(start).format('DD/MM/YYYY')
    const endDate = moment(end).format('DD/MM/YYYY')
    try {
      yield put(A.fetchTransactionHistoryLoading())
      const currency = yield select(selectors.settings.getCurrency)
      if (address) {
        const data = yield call(
          api.getTransactionHistory,
          'BTC',
          address,
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
          'BTC',
          active,
          currency.getOrElse('USD'),
          startDate,
          end
        )
        yield put(A.fetchTransactionHistorySuccess(data))
      }
    } catch (e) {
      yield put(A.fetchTransactionHistoryFailure(e.message))
    }
  }

  const __processTxs = function * (txs) {
    // Page == Remote ([Tx])
    // Remote(wallet)
    const wallet = yield select(walletSelectors.getWallet)
    const walletR = Remote.of(wallet)
    // Remote(lockboxXpubs)
    const accountListR = (yield select(getLockboxBtcAccounts))
      .map(HDAccountList.fromJS)
      .getOrElse([])
    const addressLabels = (yield select(getAddressLabels)).getOrElse({})
    const txNotes = Wallet.selectTxNotes(wallet)

    // transformTx :: wallet -> Tx
    // ProcessPage :: wallet -> [Tx] -> [Tx]
    const ProcessTxs = (wallet, accountList, txList, txNotes, addressLabels) =>
      map(
        transformTx.bind(
          undefined,
          wallet.getOrFail(MISSING_WALLET),
          accountList,
          txNotes,
          addressLabels
        ),
        txList
      )
    // ProcessRemotePage :: Page -> Page
    return ProcessTxs(walletR, accountListR, txs, txNotes, addressLabels)
  }

  const fetchFiatAtTime = function * (action) {
    const { hash, amount, time, currency } = action.payload
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
    fetchData,
    fetchRates,
    fetchFiatAtTime,
    fetchTransactionHistory,
    fetchTransactions,
    watchTransactions,
    __processTxs
  }
}
