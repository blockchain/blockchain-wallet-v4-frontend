import BigNumber from 'bignumber.js'
import { format, fromUnixTime, getTime, getUnixTime, isAfter, isBefore } from 'date-fns'
import { Contract } from 'ethers'
import {
  addIndex,
  equals,
  filter,
  flatten,
  isNil,
  length,
  map,
  nth,
  path,
  pluck,
  prop,
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
        return getTime(new Date(b.insertedAt)) - getTime(new Date(a.insertedAt))
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
    ethAddress,
    prunedTxList,
    historicalPrices,
    currentPrice,
    fiatCurrencySymbol,
    coin
  ) {
    const mapIndexed = addIndex(map)
    return mapIndexed((tx, idx) => {
      // check if tx was just gas fees for erc20
      // @ts-ignore
      const isTxEthGasFee = tx.erc20 && coin === 'ETH'
      // @ts-ignore
      let txType = prop('type', tx) as string

      // attempt to identify the type if unknown
      if (txType === 'unknown') {
        const ethAddrLower = ethAddress.toLowerCase()
        // @ts-ignore
        if (tx.from.toLowerCase() === ethAddrLower) {
          txType = 'sent'
        }
        // @ts-ignore
        if (tx.to.toLowerCase() === ethAddrLower) {
          txType = 'received'
        }
        // @ts-ignore
        if (isTxEthGasFee) {
          txType = 'gas_fee'
        }
      }

      const negativeSignOrEmpty = equals('sent', txType) ? '-' : ''
      const priceAtTime = new BigNumber(
        // @ts-ignore
        prop('price', nth(idx, historicalPrices))
      )

      // @ts-ignore
      const value = isTxEthGasFee ? tx.fee.data : (tx.amount as string)
      const valueConverted = Exchange.convertCoinToCoin({
        coin,
        value
      })

      const amountBig = new BigNumber(valueConverted)
      const valueThen = amountBig.multipliedBy(priceAtTime).toFixed(2)
      const valueNow = amountBig.multipliedBy(new BigNumber(currentPrice)).toFixed(2)

      return {
        amount: `${negativeSignOrEmpty}${amountBig.toString()}`,
        // @ts-ignore
        date: format(fromUnixTime(tx.time), 'yyyy-MM-dd'),

        // @ts-ignore
        description: prop('description', tx),

        exchange_rate_then: fiatCurrencySymbol + priceAtTime.toFixed(2),

        exchange_rate_then_raw: Number(priceAtTime.toFixed(2)),

        fee:
          txType === 'gas_fee'
            ? // @ts-ignore
              Number(Exchange.convertCoinToCoin({ coin, value: tx.fee.data })) * -1
            : // @ts-ignore
              Number(Exchange.convertCoinToCoin({ coin, value: tx.fee.data })),

        // @ts-ignore
        hash: prop('hash', tx),
        // @ts-ignore
        time: tx.time,
        type: txType,
        value_now: `${fiatCurrencySymbol}${negativeSignOrEmpty}${valueNow}`,
        value_now_raw: valueNow,
        value_then: `${fiatCurrencySymbol}${negativeSignOrEmpty}${valueThen}`,
        value_then_raw: txType === 'gas_fee' ? Number(valueThen) * -1 : valueThen
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
        isAfter(
          Number(fullTxList[fullTxList.length - 1].timestamp),
          getUnixTime(new Date(startDate))
        )
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
      const processedTxList = yield call(__processReportTxs, ethAddress, fullTxList, startDate, endDate)
      yield put(A.fetchTransactionHistorySuccess(processedTxList))
    } catch (e) {
      yield put(A.fetchTransactionHistoryFailure(e.message))
    }
  }

  const fetchLegacyBalance = function* () {
    try {
      yield put(A.fetchLegacyBalanceLoading())
      const addr = (yield select(kvStoreSelectors.getLegacyAccountAddress)).getOrElse('')
      const balances = yield call(api.getEthBalances, addr)
      const balance = path([addr, 'balance'], balances)
      yield put(A.fetchLegacyBalanceSuccess(balance))
    } catch (e) {
      yield put(A.fetchLegacyBalanceFailure(e))
    }
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
      yield all(
        data.tokenAccounts.map(function* (val) {
          const symbol = Object.keys(window.coins).find(
            (coin: string) =>
              window.coins[coin].coinfig.type?.erc20Address?.toLowerCase() ===
              toLower(val.tokenHash)
          )
          if (!symbol) return
          if (symbol === 'WETH') return
          const { coinfig } = window.coins[symbol]
          const contract = coinfig.type.erc20Address
          const tokenData = data.tokenAccounts.find(
            ({ tokenHash }) => toLower(tokenHash) === toLower(contract as string)
          )
          if (!contract) return

          yield put(
            A.fetchErc20DataSuccess(
              symbol,
              tokenData || constructDefaultErc20Data(ethAddr, contract, symbol)
            )
          )
        })
      )

      yield put(
        A.fetchErc20AccountTokenBalancesSuccess(
          [...data.tokenAccounts.filter(({ tokenSymbol }) => tokenSymbol !== 'WETH')].sort((a, b) =>
            a.balance < b.balance ? -1 : 1
          )
        )
      )

      try {
        // Because there is a discrepancy between /eth/v2/<addr>/tokens
        // and on chain data
        const wethAddr = window.coins.WETH.coinfig.type.erc20Address || ''
        const wethAbi = [
          {
            constant: true,
            inputs: [
              {
                name: '_owner',
                type: 'address'
              }
            ],
            name: 'balanceOf',
            outputs: [
              {
                name: 'balance',
                type: 'uint256'
              }
            ],
            payable: false,
            type: 'function'
          }
        ]
        const contract = new Contract(wethAddr, wethAbi, api.ethProvider)
        const balance = yield call(contract.balanceOf, ethAddr)
        const balanceString = balance.toString()
        const wethTokenData = constructDefaultErc20Data(ethAddr, wethAddr, 'WETH', balanceString)
        yield put(A.fetchErc20DataSuccess('WETH', wethTokenData))
        yield put(
          A.fetchErc20AccountTokenBalancesSuccess(
            [
              ...data.tokenAccounts.filter(({ tokenSymbol }) => tokenSymbol !== 'WETH'),
              wethTokenData
            ].sort((a, b) => (a.balance < b.balance ? -1 : 1))
          )
        )
      } catch (e) {
        // maybe an issue with rpc call, don't throw so balances still load
      }
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
        return getTime(new Date(b.insertedAt)) - getTime(new Date(a.insertedAt))
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
        isAfter(
          Number(fullTxList[fullTxList.length - 1].timestamp),
          getUnixTime(new Date(startDate))
        )
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
        ethAddress,
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

  const __processReportTxs = function* (ethAddress, rawTxList, startDate, endDate) {
    // eslint-disable-next-line
    const fullTxList = yield call(__processTxs, rawTxList)
    const ethMarketData = selectors.data.coins.getRates('ETH', yield select()).getOrFail('No rates')

    // remove txs that dont match coin type and are not within date range
    const prunedTxList = filter((tx) => {
      // returns true if tx is in-between startDate and endDate
      return (
        // @ts-ignore
        isAfter(fromUnixTime(tx.time), new Date(startDate)) &&
        // @ts-ignore
        isBefore(fromUnixTime(tx.time), new Date(endDate))
      )
    }, fullTxList)

    // return empty list if no tx found in filter set
    if (!length(prunedTxList)) return []
    // @ts-ignore
    const txTimestamps = pluck('time', prunedTxList)
    const fiatCurrency = (yield select(selectors.settings.getCurrency)).getOrElse('USD')

    // fetch historical price data
    const historicalPrices = yield call(
      api.getPriceTimestampSeries,
      'ETH',
      fiatCurrency,
      txTimestamps
    )

    // build and return report model
    return yield call(
      __buildTransactionReportModel,
      ethAddress,
      prunedTxList,
      historicalPrices,
      ethMarketData.price,
      Exchange.getSymbol(fiatCurrency),
      'ETH'
    )
  }

  const __processErc20ReportTxs = function* (ethAddress, rawTxList, startDate, endDate, token) {
    // @ts-ignore
    // eslint-disable-next-line
    const fullTxList = yield call(__processErc20Txs, rawTxList)
    const marketData = selectors.data.coins.getRates(token, yield select()).getOrFail('No rates')

    // remove txs that dont match coin type and are not within date range
    const prunedTxList = filter((tx) => {
      // returns true if tx is in-between startDate and endDate
      return (
        // @ts-ignore
        isAfter(fromUnixTime(tx.time), new Date(startDate)) &&
        // @ts-ignore
        isBefore(fromUnixTime(tx.time), new Date(endDate))
      )
    }, fullTxList)

    // return empty list if no tx found in filter set
    if (!length(prunedTxList)) return []
    // @ts-ignore
    const txTimestamps = pluck('time', prunedTxList)
    const fiatCurrency = (yield select(selectors.settings.getCurrency)).getOrElse('USD')

    // fetch historical price data
    const historicalPrices = yield call(
      api.getPriceTimestampSeries,
      toUpper(token),
      fiatCurrency,
      txTimestamps
    )

    // build and return report model
    return yield call(
      __buildTransactionReportModel,
      ethAddress,
      prunedTxList,
      historicalPrices,
      marketData.price,
      Exchange.getSymbol(fiatCurrency),
      toUpper(token)
    )
  }

  //
  // PRIVATE UTILS
  //
  const __processTxs = function* (txs) {
    const accountsR = yield select(kvStoreSelectors.getAccounts)
    const addresses = accountsR.getOrElse([]).map(prop('addr'))
    const tokens = selectors.data.coins.getErc20Coins()
    const erc20Contracts = tokens.map((coin) => window.coins[coin].coinfig.type.erc20Address)
    const state = yield select()
    return map(transformTx(addresses, erc20Contracts, state), txs)
  }
  const __processErc20Txs = function* (txs, token) {
    const accountsR = yield select(kvStoreSelectors.getAccounts)
    const addresses = accountsR.getOrElse([]).map(prop('addr'))
    const state = yield select()
    return map(transformErc20Tx(addresses, state, token), txs)
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
