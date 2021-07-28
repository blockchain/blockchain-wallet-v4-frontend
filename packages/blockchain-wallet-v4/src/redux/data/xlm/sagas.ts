import BigNumber from 'bignumber.js'
import moment from 'moment'
import {
  addIndex,
  compose,
  concat,
  equals,
  filter,
  flatten,
  join,
  last,
  length,
  map,
  nth,
  path,
  pluck,
  prop,
  reduce,
  takeLast,
  unnest,
  values
} from 'ramda'
import { all, call, put, select } from 'redux-saga/effects'

import { APIType } from 'core/network/api'
import { XlmTxType } from 'core/transactions/types'
import { FetchCustodialOrdersAndTransactionsReturnType } from 'core/types'

import * as Exchange from '../../../exchange'
import Remote from '../../../remote'
import { xlm } from '../../../transactions'
import { getLockboxXlmAccounts } from '../../kvStore/lockbox/selectors'
import { getAccounts, getXlmTxNotes } from '../../kvStore/xlm/selectors'
import * as selectors from '../../selectors'
import simpleBuySagas from '../custodial/sagas'
import * as A from './actions'
import * as S from './selectors'

const { decodeOperations, isLumenOperation, transformTx } = xlm

export const ACCOUNT_NOT_FOUND = 'Not Found'
export const TX_PER_PAGE = 10
export const TX_REPORT_PAGE_SIZE = 50

export const sumBigNumbers = reduce(
  // @ts-ignore
  (num1, num2) => new BigNumber.sum(num1, num2).toString(),
  '0'
)

const sumBalance = compose(
  sumBigNumbers,
  // @ts-ignore
  map((account) => account.map(S.selectBalanceFromAccount).getOrElse('0')),
  // @ts-ignore
  values
)

export default ({ api, networks }: { api: APIType; networks: any }) => {
  const { fetchCustodialOrdersAndTransactions } = simpleBuySagas({ api })

  const fetchLedgerDetails = function* () {
    try {
      yield put(A.setLedgerDetailsLoading())
      const ledger = yield call(api.getLatestLedgerDetails)
      yield put(A.setLedgerDetailsSuccess(ledger))
    } catch (e) {
      yield put(A.setLedgerDetailsFailure(e))
    }
  }

  const createAccounts = function* () {
    if (networks.xlm !== 'testnet') return
    try {
      const accountIds = yield select(S.getContext)
      yield all(accountIds.map((id) => call(api.createXlmAccount, id)))
      yield call(fetchData)
    } catch (e) {}
  }

  const fetchAccount = function* (id) {
    try {
      yield put(A.fetchAccountLoading(id))
      const account = yield call(api.getXlmAccount, id)
      yield put(A.fetchAccountSuccess(id, account))
    } catch (e) {
      yield put(A.fetchAccountFailure(id, e))
    }
  }

  const fetchData = function* () {
    const accountIds = yield select(S.getContext)
    yield all(accountIds.map((id) => call(fetchAccount, id)))
    const accounts = yield select(S.getAccounts)
    const data = { info: { final_balance: sumBalance(accounts) } }
    yield put(A.fetchDataSuccess(data))
  }

  const fetchRates = function* () {
    try {
      yield put(A.setRatesLoading())
      const currencyR = selectors.settings.getCurrency(yield select())
      const currency = currencyR.getOrElse('USD')
      const data = yield call(api.getCoinTicker, 'XLM', currency)
      yield put(A.setRatesSuccess(data))
    } catch (e) {
      yield put(A.setRatesFailure(e))
    }
  }

  const fetchTransactions = function* (action) {
    try {
      const { payload } = action
      const { accountId, reset } = payload
      const defaultAccountR = yield select(selectors.kvStore.xlm.getDefaultAccountId)
      const publicKey = accountId || defaultAccountR.getOrFail(ACCOUNT_NOT_FOUND)
      const pages = yield select(S.getTransactions)
      const pagingToken = (last(pages) || Remote.NotAsked)
        .map(last)
        .map(prop('pagingToken'))
        .getOrElse(null)
      const offset = reset ? 0 : length(pages) * TX_PER_PAGE
      const transactionsAtBound = yield select(S.getTransactionsAtBound)
      if (Remote.Loading.is(last(pages))) return
      if (transactionsAtBound && !reset) return
      yield put(A.fetchTransactionsLoading(reset))
      let txs: Array<any> = []
      try {
        txs = yield call(api.getXlmTransactions, {
          limit: TX_PER_PAGE,
          pagingToken,
          publicKey,
          reset
        })
      } catch (e) {}
      const atBounds = length(txs) < TX_PER_PAGE
      yield put(A.transactionsAtBound(atBounds))
      const nextSBTransactionsURL = selectors.data.custodial.getNextSBTransactionsURL(
        yield select(),
        'XLM'
      )
      const txPage: Array<XlmTxType> = yield call(__processTxs, txs)
      const custodialPage: FetchCustodialOrdersAndTransactionsReturnType = yield call(
        fetchCustodialOrdersAndTransactions,
        txPage,
        offset,
        atBounds,
        'XLM',
        reset ? null : nextSBTransactionsURL
      )
      const page = flatten([txPage, custodialPage.orders]).sort((a, b) => {
        return moment(b.insertedAt).valueOf() - moment(a.insertedAt).valueOf()
      })
      yield put(A.fetchTransactionsSuccess(page, reset))
    } catch (e) {
      const statusCode = path(['response', 'status'], e)
      if (statusCode === 404) {
        yield put(A.fetchTransactionsSuccess([]))
        yield put(A.transactionsAtBound(true))
        return
      }
      yield put(A.fetchTransactionsFailure(e.message))
    }
  }

  const fetchTransactionHistory = function* ({ payload }) {
    const { address, end, start } = payload
    let pagingToken

    try {
      yield put(A.fetchTransactionHistoryLoading())
      let fullTxList = yield call(api.getXlmTransactions, {
        limit: TX_REPORT_PAGE_SIZE,
        publicKey: address
      })
      // @ts-ignore
      pagingToken = prop('paging_token', last(fullTxList))

      // keep fetching pages until last (oldest) tx from previous page
      // is before requested start date
      // @ts-ignore
      while (moment(prop('created_at', last(fullTxList))).isAfter(start)) {
        const txPage = yield call(api.getXlmTransactions, {
          limit: TX_REPORT_PAGE_SIZE,
          pagingToken,
          publicKey: address
        })
        // exit if no results returned
        if (!length(txPage)) break
        // @ts-ignore
        pagingToken = prop('paging_token', last(txPage))
        fullTxList = fullTxList.concat(txPage)
      }
      const processedTxList = yield call(__processReportTxs, fullTxList, start, end)
      yield put(A.fetchTransactionHistorySuccess(processedTxList))
    } catch (e) {
      yield put(A.fetchTransactionHistoryFailure(e.message))
    }
  }

  const __processReportTxs = function* (rawTxList, startDate, endDate) {
    const mapIndexed = addIndex(map)
    const fullTxList = yield call(__processTxs, rawTxList)
    const xlmMarketData = (yield select(selectors.data.xlm.getRates)).getOrFail()

    // remove txs that dont match coin type and are not within date range
    const prunedTxList = filter(
      // @ts-ignore
      (tx) => moment.unix(tx.time).isBetween(startDate, endDate),
      fullTxList
    )

    // return empty list if no tx found in filter set
    if (!length(prunedTxList)) return []
    // @ts-ignore
    const txTimestamps = pluck('time', prunedTxList)
    const currency = (yield select(selectors.settings.getCurrency)).getOrElse('USD')
    const currentPrices = prop(currency, xlmMarketData)
    const currentPrice = new BigNumber(prop('last', currentPrices))
    const fiatSymbol = prop('symbol', currentPrices)

    // fetch historical price data
    const historicalPrices = yield call(api.getPriceTimestampSeries, 'XLM', currency, txTimestamps)

    // build and return report model
    return mapIndexed((tx, idx) => {
      const timeFormatted = join(
        ' ',
        takeLast(
          2,
          moment
            // @ts-ignore
            .unix(tx.time)
            .toString()
            .split(' ')
        )
      )
      // @ts-ignore
      const txType = prop('type', tx)
      const negativeSignOrEmpty = equals('sent', txType) ? '-' : ''
      const priceAtTime = new BigNumber(
        // @ts-ignore
        prop('price', nth(idx, historicalPrices))
      )
      const amountBig = new BigNumber(
        Exchange.convertCoinToCoin({
          coin: 'XLM',
          // @ts-ignore
          value: tx.amount
        })
      )
      const valueThen = amountBig.multipliedBy(priceAtTime).toFixed(2)
      const valueNow = amountBig.multipliedBy(currentPrice).toFixed(2)
      return {
        amount: `${negativeSignOrEmpty}${amountBig.toString()}`,
        // @ts-ignore
        date: moment.unix(prop('time', tx)).format('YYYY-MM-DD'),
        // @ts-ignore
        description: prop('description', tx),

        exchange_rate_then: fiatSymbol + priceAtTime.toFixed(2),
        // @ts-ignore
        hash: prop('hash', tx),
        time: timeFormatted,
        type: txType,
        value_now: `${fiatSymbol}${negativeSignOrEmpty}${valueNow}`,
        value_then: `${fiatSymbol}${negativeSignOrEmpty}${valueThen}`
      }
    }, prunedTxList)
  }

  const __processTxs = function* (txList) {
    const walletAccounts = (yield select(getAccounts)).getOrElse([])
    const lockboxAccounts = (yield select(getLockboxXlmAccounts)).getOrElse([])
    const txNotes = (yield select(getXlmTxNotes)).getOrElse({})
    const accounts = concat(walletAccounts, lockboxAccounts)
    return unnest(
      map((tx) => {
        const operations = decodeOperations(tx)
        return compose(
          // @ts-ignore
          filter(prop('belongsToWallet')),
          map(transformTx(accounts, txNotes, tx)),
          // @ts-ignore
          filter(isLumenOperation)
        )(operations)
      }, txList)
    )
  }

  return {
    __processTxs,
    createAccounts,
    fetchData,
    fetchLedgerDetails,
    fetchRates,
    fetchTransactionHistory,
    fetchTransactions
  }
}
