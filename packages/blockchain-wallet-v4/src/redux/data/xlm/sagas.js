import * as A from './actions'
import * as Exchange from '../../../exchange'
import * as S from './selectors'
import * as selectors from '../../selectors'
import {
  addIndex,
  compose,
  concat,
  equals,
  filter,
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
import { getAccounts, getXlmTxNotes } from '../../kvStore/xlm/selectors'
import { getLockboxXlmAccounts } from '../../kvStore/lockbox/selectors'
import { xlm } from '../../../transactions'
import BigNumber from 'bignumber.js'
import moment from 'moment'
import Remote from '../../../remote'

const { transformTx, decodeOperations, isLumenOperation } = xlm

export const ACCOUNT_NOT_FOUND = 'Not Found'
export const TX_PER_PAGE = 10
export const TX_REPORT_PAGE_SIZE = 50

export const sumBigNumbers = reduce(
  (num1, num2) => new BigNumber.sum(num1, num2).toString(),
  '0'
)

const sumBalance = compose(
  sumBigNumbers,
  map(account => account.map(S.selectBalanceFromAccount).getOrElse('0')),
  values
)

export default ({ api, networks }) => {
  const fetchLedgerDetails = function * () {
    try {
      yield put(A.setLedgerDetailsLoading())
      const ledger = yield call(api.getLatestLedgerDetails)
      yield put(A.setLedgerDetailsSuccess(ledger))
    } catch (e) {
      yield put(A.setLedgerDetailsFailure(e))
    }
  }

  const createAccounts = function * () {
    if (networks.xlm !== 'testnet') return
    try {
      const accountIds = yield select(S.getContext)
      yield all(accountIds.map(id => call(api.createXlmAccount, id)))
      yield call(fetchData)
    } catch (e) {}
  }

  const fetchAccount = function * (id) {
    try {
      yield put(A.fetchAccountLoading(id))
      const account = yield call(api.getXlmAccount, id)
      yield put(A.fetchAccountSuccess(id, account))
    } catch (e) {
      yield put(A.fetchAccountFailure(id, e))
    }
  }

  const fetchData = function * () {
    const accountIds = yield select(S.getContext)
    yield all(accountIds.map(id => call(fetchAccount, id)))
    const accounts = yield select(S.getAccounts)
    const data = { info: { final_balance: sumBalance(accounts) } }
    yield put(A.fetchDataSuccess(data))
  }

  const fetchRates = function * () {
    try {
      yield put(A.setRatesLoading())
      const data = yield call(api.getXlmTicker)
      yield put(A.setRatesSuccess(data))
    } catch (e) {
      yield put(A.setRatesFailure(e))
    }
  }

  const fetchTransactions = function * (action) {
    try {
      const { payload } = action
      const { accountId, reset } = payload
      const defaultAccountR = yield select(
        selectors.kvStore.xlm.getDefaultAccountId
      )
      const publicKey =
        accountId || defaultAccountR.getOrFail(ACCOUNT_NOT_FOUND)
      const pages = yield select(S.getTransactions)
      const pagingToken = (last(pages) || Remote.NotAsked)
        .map(last)
        .map(prop('pagingToken'))
        .getOrElse(null)
      const offset = reset ? null : length(pages) * TX_PER_PAGE
      const transactionsAtBound = yield select(S.getTransactionsAtBound)
      if (Remote.Loading.is(last(pages))) return
      if (transactionsAtBound && !reset) return
      yield put(A.fetchTransactionsLoading(reset))
      const txs = yield call(api.getXlmTransactions, {
        publicKey,
        limit: TX_PER_PAGE,
        cursor: offset,
        pagingToken,
        reset
      })
      const atBounds = length(txs) < TX_PER_PAGE
      yield put(A.transactionsAtBound(atBounds))
      const page = yield call(__processTxs, txs)
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

  const fetchTransactionHistory = function * ({ payload }) {
    const { address, start, end } = payload
    let currentPage = 0
    let pagingToken = null

    try {
      yield put(A.fetchTransactionHistoryLoading())
      let fullTxList = yield call(api.getXlmTransactions, {
        publicKey: address,
        limit: TX_REPORT_PAGE_SIZE,
        cursor: currentPage
      })
      currentPage++
      pagingToken = prop('paging_token', last(fullTxList))

      // keep fetching pages until last (oldest) tx from previous page
      // is before requested start date
      while (moment(prop('created_at', last(fullTxList))).isAfter(start)) {
        const txPage = yield call(api.getXlmTransactions, {
          publicKey: address,
          limit: TX_REPORT_PAGE_SIZE,
          cursor: currentPage * TX_REPORT_PAGE_SIZE,
          pagingToken
        })
        pagingToken = prop('paging_token', last(txPage))
        fullTxList = fullTxList.concat(txPage)
        currentPage++
      }
      const processedTxList = yield call(
        __processReportTxs,
        fullTxList,
        start,
        end
      )
      yield put(A.fetchTransactionHistorySuccess(processedTxList))
    } catch (e) {
      yield put(A.fetchTransactionHistoryFailure(e.message))
    }
  }

  const __processReportTxs = function * (rawTxList, startDate, endDate) {
    const mapIndexed = addIndex(map)
    const fullTxList = yield call(__processTxs, rawTxList)
    const xlmMarketData = (yield select(
      selectors.data.xlm.getRates
    )).getOrFail()

    // remove txs that dont match coin type and are not within date range
    const prunedTxList = filter(
      tx => moment.unix(tx.time).isBetween(startDate, endDate),
      fullTxList
    )

    // return empty list if no tx found in filter set
    if (!length(prunedTxList)) return []
    const txTimestamps = pluck('time', prunedTxList)
    const currency = (yield select(selectors.settings.getCurrency)).getOrElse(
      'USD'
    )
    const currentPrices = prop(currency, xlmMarketData)
    const currentPrice = new BigNumber(prop('last', currentPrices))
    const fiatSymbol = prop('symbol', currentPrices)

    // fetch historical price data
    const historicalPrices = yield call(
      api.getPriceTimestampSeries,
      'XLM',
      currency,
      txTimestamps
    )

    // build and return report model
    return mapIndexed((tx, idx) => {
      const timeFormatted = join(
        ' ',
        takeLast(
          2,
          moment
            .unix(tx.time)
            .toString()
            .split(' ')
        )
      )
      const txType = prop('type', tx)
      const negativeSignOrEmpty = equals('sent', txType) ? '-' : ''
      const priceAtTime = new BigNumber(
        prop('price', nth(idx, historicalPrices))
      )
      const amountBig = new BigNumber(
        Exchange.convertXlmToXlm({
          value: tx.amount,
          fromUnit: 'STROOP',
          toUnit: 'XLM'
        }).value
      )
      const valueThen = amountBig.multipliedBy(priceAtTime).toFixed(2)
      const valueNow = amountBig.multipliedBy(currentPrice).toFixed(2)
      return {
        amount: `${negativeSignOrEmpty}${amountBig.toString()}`,
        date: moment.unix(prop('time', tx)).format('YYYY-MM-DD'),
        description: prop('description', tx),
        hash: prop('hash', tx),
        time: timeFormatted,
        type: txType,
        value_then: `${fiatSymbol}${negativeSignOrEmpty}${valueThen}`,
        value_now: `${fiatSymbol}${negativeSignOrEmpty}${valueNow}`,
        exchange_rate_then: fiatSymbol + priceAtTime.toFixed(2)
      }
    }, prunedTxList)
  }

  const __processTxs = function * (txList) {
    const walletAccounts = (yield select(getAccounts)).getOrElse([])
    const lockboxAccounts = (yield select(getLockboxXlmAccounts)).getOrElse([])
    const txNotes = (yield select(getXlmTxNotes)).getOrElse({})
    const accounts = concat(walletAccounts, lockboxAccounts)
    return unnest(
      map(tx => {
        const operations = decodeOperations(tx)
        return compose(
          filter(prop('belongsToWallet')),
          map(transformTx(accounts, txNotes, tx)),
          filter(isLumenOperation)
        )(operations)
      }, txList)
    )
  }

  return {
    createAccounts,
    fetchLedgerDetails,
    fetchData,
    fetchRates,
    fetchTransactions,
    fetchTransactionHistory,
    __processTxs
  }
}
