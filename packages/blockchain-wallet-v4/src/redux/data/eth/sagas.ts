import BigNumber from 'bignumber.js'
import moment from 'moment'
import {
  addIndex,
  concat,
  equals,
  filter,
  flatten,
  isNil,
  join,
  last,
  length,
  map,
  nth,
  path,
  pluck,
  prop,
  takeLast,
  toLower,
  toUpper
} from 'ramda'
import { all, call, put, select, take } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { EthRawTxType } from '@core/network/api/eth/types'
import { EthProcessedTxType } from '@core/transactions/types'
import { Await, Erc20CoinType, FetchCustodialOrdersAndTransactionsReturnType } from '@core/types'
import { errorHandler } from '@core/utils'
import { calculateFee } from '@core/utils/eth'

import * as Exchange from '../../../exchange'
import * as transactions from '../../../transactions'
import * as kvStoreSelectors from '../../kvStore/eth/selectors'
import { getLockboxEthContext } from '../../kvStore/lockbox/selectors'
import * as selectors from '../../selectors'
import custodialSagas from '../custodial/sagas'
import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'
import { constructDefaultErc20Data } from './utils'

const { transformErc20Tx, transformTx } = transactions.eth
const TX_PER_PAGE = 50
const TX_REPORT_PAGE_SIZE = 500
const CONTEXT_FAILURE = 'Could not get ETH context.'

export default ({ api }: { api: APIType }) => {
  const { fetchCustodialOrdersAndTransactions } = custodialSagas({ api })
  //
  // ETH
  //
  const fetchData = function* () {
    try {
      const context = kvStoreSelectors.getDefaultAddress(yield select()).getOrFail('No ETH address')
      const balance: Await<ReturnType<typeof api.getEthAccountBalance>> = yield call(
        api.getEthAccountBalance,
        context
      )
      const nonce: Await<ReturnType<typeof api.getEthAccountNonce>> = yield call(
        api.getEthAccountNonce,
        context
      )
      const latestBlock: Await<ReturnType<typeof api.getEthLatestBlock>> = yield call(
        api.getEthLatestBlock
      )

      const ethData = {
        addresses: {
          [context]: {
            balance,
            nonce
          }
        },
        latest_block: latestBlock
      }

      yield put(A.fetchDataSuccess(ethData))
      // eslint-disable-next-line
      try {
        yield call(checkForLowEthBalance)
      } catch (e) {
        // do nothing
      }
    } catch (e) {
      yield put(A.fetchDataFailure(errorHandler(e)))
    }
  }

  const fetchLatestBlock = function* () {
    try {
      yield put(A.fetchLatestBlockLoading())
      const data = yield call(api.getEthLatestBlock)
      yield put(A.fetchLatestBlockSuccess(data))
    } catch (e) {
      yield put(A.fetchLatestBlockFailure(e.message))
    }
  }

  const fetchTransactions = function* ({ payload }) {
    const { address, reset } = payload
    try {
      const defaultAccountR = yield select(selectors.kvStore.eth.getContext)
      const ethAddress = address || defaultAccountR.getOrFail(CONTEXT_FAILURE)
      const pageList = yield select(S.getTransactions())
      const nextPage = reset ? 0 : length(pageList)
      const transactionsAtBound = yield select(S.getTransactionsAtBound())

      if (transactionsAtBound && !reset) return
      yield put(A.fetchTransactionsLoading(reset))
      const data = yield call(api.getEthTransactionsV2, ethAddress, nextPage, TX_PER_PAGE)
      const txPage = prop('transactions', data)
      const atBounds = length(txPage) < TX_PER_PAGE
      yield put(A.transactionsAtBound(atBounds))

      // eslint-disable-next-line
      const processedTxPage: Array<EthProcessedTxType> = yield call(__processTxs, txPage)
      const nextBSTransactionsURL = selectors.data.custodial.getNextBSTransactionsURL(
        yield select(),
        'ETH'
      )
      const custodialPage: FetchCustodialOrdersAndTransactionsReturnType = yield call(
        fetchCustodialOrdersAndTransactions,
        processedTxPage,
        nextPage,
        atBounds,
        'ETH',
        reset ? null : nextBSTransactionsURL
      )
      const page = flatten([processedTxPage, custodialPage.orders]).sort((a, b) => {
        return moment(b.insertedAt).valueOf() - moment(a.insertedAt).valueOf()
      })
      yield put(A.fetchTransactionsSuccess(page, reset))
    } catch (e) {
      yield put(A.fetchTransactionsFailure(e.message))
    }
  }

  const watchTransactions = function* () {
    while (true) {
      const action = yield take(AT.FETCH_ETH_TRANSACTIONS)
      yield call(fetchTransactions, action)
    }
  }

  const __buildTransactionReportModel = function (
    prunedTxList,
    historicalPrices,
    currentPrices,
    coin
  ) {
    const mapIndexed = addIndex(map)
    const fiatSymbol = prop('symbol', currentPrices)
    const currentPrice = new BigNumber(prop('last', currentPrices))
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
      const txType = prop('type', tx) as string
      const negativeSignOrEmpty = equals('sent', txType) ? '-' : ''
      const priceAtTime = new BigNumber(
        // @ts-ignore
        prop('price', nth(idx, historicalPrices))
      )
      // @ts-ignore
      const value = tx.amount as string
      const amountBig = new BigNumber(
        Exchange.convertCoinToCoin({
          coin,
          value
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

  const fetchTransactionHistory = function* ({ payload }) {
    const { address, endDate, startDate } = payload
    let currentPage = 0

    try {
      yield put(A.fetchTransactionHistoryLoading())
      const defaultAccountR = yield select(selectors.kvStore.eth.getContext)
      const ethAddress = address || defaultAccountR.getOrFail(CONTEXT_FAILURE)

      // fetch account summary (includes first page of txs)
      const accountSummary = yield call(
        api.getEthAccountSummaryV2,
        ethAddress,
        currentPage,
        TX_REPORT_PAGE_SIZE
      )
      let fullTxList = prop('accountTransactions', accountSummary)
      const txCount = prop('transactionCount', accountSummary)
      currentPage += 1

      // keep fetching pages until we reach last page or last (oldest) tx
      // from previous page is before requested start date
      while (
        currentPage <= Math.ceil(txCount / TX_REPORT_PAGE_SIZE) &&
        // @ts-ignore
        moment.unix(prop('timestamp', last(fullTxList))).isAfter(startDate)
      ) {
        const txPage = yield call(
          api.getEthTransactionsV2,
          ethAddress,
          currentPage,
          TX_REPORT_PAGE_SIZE
        )
        fullTxList = fullTxList.concat(prop('transactions', txPage))
        currentPage += 1
      }
      // process txs further for report
      // eslint-disable-next-line
      const processedTxList = yield call(__processReportTxs, fullTxList, startDate, endDate)
      yield put(A.fetchTransactionHistorySuccess(processedTxList))
    } catch (e) {
      yield put(A.fetchTransactionHistoryFailure(e.message))
    }
  }

  const fetchLegacyBalance = function* () {
    try {
      yield put(A.fetchLegacyBalanceLoading())
      const addrR = yield select(kvStoreSelectors.getLegacyAccountAddress)
      const addr = addrR.getOrElse('')
      const balances = yield call(api.getEthBalances, addr)
      const balance = path([addr, 'balance'], balances)
      yield put(A.fetchLegacyBalanceSuccess(balance))
    } catch (e) {
      yield put(A.fetchLegacyBalanceFailure(e))
    }
  }

  const checkForLowEthBalance = function* () {
    // TODO: ERC20 check for any erc20 balance in future
    const erc20Balance = (yield select(S.getErc20Balance, 'PAX')).getOrElse(0)
    const weiBalance = (yield select(S.getBalance)).getOrFail()
    const ethRates = selectors.data.coins.getRates('ETH', yield select()).getOrFail('No rates')
    const ethBalance = Exchange.convertCoinToFiat({
      coin: 'ETH',
      currency: 'USD',
      rates: ethRates,
      value: weiBalance
    })
    // less than $1 eth and has PAX, set warning flag to true
    const showWarning = parseInt(ethBalance) < 1 && erc20Balance > 0
    yield put(A.checkLowEthBalanceSuccess(showWarning))
  }

  //
  // ERC20
  //
  const fetchErc20Data = function* (action: ReturnType<typeof A.fetchErc20Data>) {
    const { coin } = action.payload
    try {
      const ethAddr = (yield select(kvStoreSelectors.getDefaultAddress)).getOrFail(
        'No Default ETH Address.'
      )
      const data: ReturnType<typeof api.getAccountTokensBalances> = yield call(
        api.getAccountTokensBalances,
        ethAddr
      )

      yield put(A.fetchErc20AccountTokenBalancesSuccess(data.tokenAccounts))
      yield all(
        data.tokenAccounts.map(function* (val) {
          const symbol = toUpper(val.tokenSymbol)
          if (!window.coins[symbol]) return
          const { coinfig } = window.coins[symbol]
          if (!coinfig.type.erc20Address) return
          const contract = coinfig.type.erc20Address
          const tokenData = data.tokenAccounts.find(
            ({ tokenHash }) => toLower(tokenHash) === toLower(contract as string)
          )
          yield put(
            A.fetchErc20DataSuccess(
              symbol,
              tokenData || constructDefaultErc20Data(ethAddr, contract)
            )
          )
        })
      )
    } catch (e) {
      yield put(A.fetchErc20DataFailure(coin, prop('message', e)))
    }
  }

  const watchErc20Transactions = function* () {
    while (true) {
      const action = yield take(AT.FETCH_ERC20_TOKEN_TRANSACTIONS)
      // eslint-disable-next-line
      yield call(fetchErc20Transactions, action)
    }
  }

  const fetchErc20Transactions = function* (action) {
    const { reset, token } = action.payload
    try {
      const defaultAccountR = yield select(selectors.kvStore.eth.getContext)
      const ethAddress = defaultAccountR.getOrFail(CONTEXT_FAILURE)
      const pages = yield select(S.getErc20Transactions, token)
      const nextPage = reset ? 0 : length(pages)
      const txsAtBound = yield select(S.getErc20TransactionsAtBound, token)
      const contractAddress = window.coins[token].coinfig.type.erc20Address
      if (txsAtBound && !reset) return
      yield put(A.fetchErc20TransactionsLoading(token, reset))
      const data = yield call(
        api.getErc20TransactionsV2,
        ethAddress,
        contractAddress,
        nextPage,
        TX_PER_PAGE
      )
      const txs = prop('transfers', data)
      if (isNil(txs)) return
      const atBounds = length(txs) < TX_PER_PAGE
      yield put(A.erc20TransactionsAtBound(token, atBounds))
      // eslint-disable-next-line
      const walletPage: Array<EthProcessedTxType> = yield call(__processErc20Txs, txs, token)
      const coin: Erc20CoinType = token.toUpperCase()
      const nextBSTransactionsURL = selectors.data.custodial.getNextBSTransactionsURL(
        yield select(),
        coin
      )
      const custodialPage: FetchCustodialOrdersAndTransactionsReturnType = yield call(
        fetchCustodialOrdersAndTransactions,
        walletPage,
        nextPage,
        atBounds,
        coin,
        reset ? null : nextBSTransactionsURL
      )
      const page = flatten([walletPage, custodialPage.orders]).sort((a, b) => {
        return moment(b.insertedAt).valueOf() - moment(a.insertedAt).valueOf()
      })
      yield put(A.fetchErc20TransactionsSuccess(token, page, reset))
    } catch (e) {
      yield put(A.fetchErc20TransactionsFailure(token, e.message))
    }
  }

  const fetchErc20TransactionFee = function* (action) {
    const { hash, token } = action.payload
    try {
      yield put(A.fetchErc20TxFeeLoading(hash, token))
      const txData: EthRawTxType = yield call(api.getEthTransactionV2, hash)
      const fee = calculateFee(
        txData.gasPrice,
        txData.state === 'CONFIRMED' ? txData.gasUsed : txData.gasLimit,
        false
      )
      yield put(A.fetchErc20TxFeeSuccess(fee, hash, token))
    } catch (e) {
      yield put(A.fetchErc20TxFeeFailure(hash, token, e.message))
    }
  }

  const fetchErc20TransactionHistory = function* (action) {
    const { payload } = action
    const { address, endDate, startDate, token } = payload
    let currentPage = 0

    try {
      yield put(A.fetchErc20TransactionHistoryLoading(token))
      const defaultAccountR = yield select(selectors.kvStore.eth.getContext)
      const ethAddress = address || defaultAccountR.getOrFail(CONTEXT_FAILURE)
      const contractAddress = window.coins[token].coinfig.type.erc20Address

      // fetch account summary without any txs since erc2
      const accountSummary = yield call(
        api.getErc20AccountSummaryV2,
        ethAddress,
        contractAddress,
        currentPage,
        TX_REPORT_PAGE_SIZE
      )
      let fullTxList = prop('transfers', accountSummary)
      const txCount = prop('transferCount', accountSummary)
      currentPage += 1

      // keep fetching pages until we reach last page or last tx free previous page is before requested start date
      while (
        currentPage <= Math.ceil(txCount / TX_REPORT_PAGE_SIZE) &&
        // @ts-ignore
        moment.unix(prop('timestamp', last(fullTxList))).isAfter(startDate)
      ) {
        const txPage = yield call(
          api.getErc20TransactionsV2,
          ethAddress,
          contractAddress,
          currentPage,
          TX_REPORT_PAGE_SIZE
        )
        fullTxList = fullTxList.concat(prop('transfers', txPage))
        currentPage += 1
      }

      // process txs further for report
      const processedTxList = yield call(
        // eslint-disable-next-line
        __processErc20ReportTxs,
        fullTxList,
        startDate,
        endDate,
        token
      )

      yield put(A.fetchErc20TransactionHistorySuccess(processedTxList, token))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchErc20TransactionHistoryFailure(error, token))
    }
  }

  const __processReportTxs = function* (rawTxList, startDate, endDate) {
    // eslint-disable-next-line
    const fullTxList = yield call(__processTxs, rawTxList)
    const ethMarketData = selectors.data.coins.getRates('ETH', yield select()).getOrFail('No rates')

    // remove txs that dont match coin type and are not within date range
    const prunedTxList = filter((tx) => {
      // @ts-ignore
      return moment.unix(tx.time).isBetween(startDate, endDate)
    }, fullTxList)

    // return empty list if no tx found in filter set
    if (!length(prunedTxList)) return []
    // @ts-ignore
    const txTimestamps = pluck('time', prunedTxList)
    const currency = (yield select(selectors.settings.getCurrency)).getOrElse('USD')

    // fetch historical price data
    const historicalPrices = yield call(api.getPriceTimestampSeries, 'ETH', currency, txTimestamps)

    // build and return report model
    return yield call(
      __buildTransactionReportModel,
      prunedTxList,
      historicalPrices,
      prop(currency, ethMarketData),
      'ETH'
    )
  }

  const __processErc20ReportTxs = function* (rawTxList, startDate, endDate, token) {
    // @ts-ignore
    // eslint-disable-next-line
    const fullTxList = yield call(__processErc20Txs, rawTxList)
    const marketData = selectors.data.coins.getRates(token, yield select()).getOrFail('No rates')

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

    // fetch historical price data
    const historicalPrices = yield call(
      api.getPriceTimestampSeries,
      toUpper(token),
      currency,
      txTimestamps
    )

    // build and return report model
    return yield call(
      __buildTransactionReportModel,
      prunedTxList,
      historicalPrices,
      prop(currency, marketData),
      toUpper(token)
    )
  }

  //
  // PRIVATE UTILS
  //
  const __processTxs = function* (txs) {
    const accountsR = yield select(kvStoreSelectors.getAccounts)
    const addresses = accountsR.getOrElse([]).map(prop('addr'))
    const tokens = selectors.data.eth.getErc20Coins()
    const erc20Contracts = tokens.map((coin) => window.coins[coin].coinfig.type.erc20Address)
    const lockboxContextR = yield select(getLockboxEthContext)
    const lockboxContext = lockboxContextR.getOrElse([])
    const state = yield select()
    const ethAddresses = concat(addresses, lockboxContext)
    return map(transformTx(ethAddresses, erc20Contracts, state), txs)
  }
  const __processErc20Txs = function* (txs, token) {
    const accountsR = yield select(kvStoreSelectors.getAccounts)
    const addresses = accountsR.getOrElse([]).map(prop('addr'))
    const lockboxContextR = yield select(getLockboxEthContext)
    const lockboxContext = lockboxContextR.getOrElse([])
    const state = yield select()
    const ethAddresses = concat(addresses, lockboxContext)
    return map(transformErc20Tx(ethAddresses, state, token), txs)
  }

  return {
    __processErc20Txs,
    __processTxs,
    checkForLowEthBalance,
    fetchData,
    fetchErc20Data,
    fetchErc20TransactionFee,
    fetchErc20TransactionHistory,
    fetchErc20Transactions,
    fetchLatestBlock,
    fetchLegacyBalance,
    fetchTransactionHistory,
    fetchTransactions,
    watchErc20Transactions,
    watchTransactions
  }
}
