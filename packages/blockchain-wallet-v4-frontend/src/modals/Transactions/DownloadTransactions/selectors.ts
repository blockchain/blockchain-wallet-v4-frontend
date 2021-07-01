import { assoc, curry, map, prop } from 'ramda'
import { createSelector } from 'reselect'

import { TXNotes, Wallet } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

import { formatHaskoinData, formatTxData, reportHeaders } from './model'

const assocBTCNotes = curry((wallet, transactions) => {
  return transactions.map((transaction) => {
    const hash = prop('tx', transaction)
    const note = TXNotes.selectNote(hash, Wallet.selectTxNotes(wallet))
    return note ? assoc('note', note, transaction) : transaction
  })
})

const assocBCHNotes = curry((notes, transactions) => {
  return transactions.map((transaction) => {
    const hash = prop('tx', transaction)
    const note = notes && notes[hash]
    return note ? assoc('note', note, transaction) : transaction
  })
})

const getXlmData = createSelector(
  [selectors.core.data.xlm.getTransactionHistory],
  (dataR: selectors.core.data.xlm.getTransactionHistory) => {
    const transform = (data) => {
      const transformedData = map((tx) => formatTxData(tx, 'XLM'), data)
      return [reportHeaders].concat(transformedData)
    }
    return {
      csvData: dataR.map(transform).getOrElse([])
    }
  }
)

const getPaxData = createSelector(
  [(state) => selectors.core.data.eth.getErc20TransactionHistory(state, 'pax')],
  (dataR) => {
    const transform = (data) => {
      const transformedData = map((tx) => formatTxData(tx, 'USD-D'), data)
      return [reportHeaders].concat(transformedData)
    }
    return {
      csvData: dataR.map(transform).getOrElse([])
    }
  }
)
const getUsdtData = createSelector(
  [(state) => selectors.core.data.eth.getErc20TransactionHistory(state, 'usdt')],
  (dataR) => {
    const transform = (data) => {
      const transformedData = map((tx) => formatTxData(tx, 'USDT'), data)
      return [reportHeaders].concat(transformedData)
    }
    return {
      csvData: dataR.map(transform).getOrElse([])
    }
  }
)
const getWdgldData = createSelector(
  [(state) => selectors.core.data.eth.getErc20TransactionHistory(state, 'wdgld')],
  (dataR) => {
    const transform = (data) => {
      const transformedData = map((tx) => formatTxData(tx, 'WDGLD'), data)
      return [reportHeaders].concat(transformedData)
    }
    return {
      csvData: dataR.map(transform).getOrElse([])
    }
  }
)

const getAaveData = createSelector(
  [(state) => selectors.core.data.eth.getErc20TransactionHistory(state, 'aave')],
  (dataR) => {
    const transform = (data) => {
      const transformedData = map((tx) => formatTxData(tx, 'AAVE'), data)
      return [reportHeaders].concat(transformedData)
    }
    return {
      csvData: dataR.map(transform).getOrElse([])
    }
  }
)

const getYfiData = createSelector(
  [(state) => selectors.core.data.eth.getErc20TransactionHistory(state, 'yfi')],
  (dataR) => {
    const transform = (data) => {
      const transformedData = map((tx) => formatTxData(tx, 'YFI'), data)
      return [reportHeaders].concat(transformedData)
    }
    return {
      csvData: dataR.map(transform).getOrElse([])
    }
  }
)

const getEthData = createSelector(
  [selectors.core.data.eth.getTransactionHistory],
  (dataR: selectors.core.data.eth.getTransactionHistory) => {
    const transform = (data) => {
      const transformedData = map((tx) => formatTxData(tx, 'ETH'), data)
      return [reportHeaders].concat(transformedData)
    }
    return {
      csvData: dataR.map(transform).getOrElse([])
    }
  }
)

const getBtcData = createSelector(
  [
    selectors.core.wallet.getWallet,
    selectors.core.settings.getCurrency,
    selectors.core.data.btc.getTransactionHistory
  ],
  (wallet, currencyR, dataR: selectors.core.data.btc.getTransactionHistory) => {
    const currency = currencyR.getOrElse('USD')
    const transform = (data) => {
      const transformedData = map((tx) => formatHaskoinData(tx, 'BTC', currency), data)
      return [reportHeaders].concat(transformedData)
    }
    return {
      csvData: dataR.map(assocBTCNotes(wallet)).map(transform).getOrElse([])
    }
  }
)

const getBchData = createSelector(
  [
    selectors.core.kvStore.bch.getBchTxNotes,
    selectors.core.settings.getCurrency,
    selectors.core.data.bch.getTransactionHistory
  ],
  (
    notesR: selectors.core.kvStore.bch.getBchTxNotes,
    currencyR,
    dataR: selectors.core.data.bch.getTransactionHistory
  ) => {
    const currency = currencyR.getOrElse('USD')
    const transform = (data) => {
      const transformedData = map((tx) => formatHaskoinData(tx, 'BCH', currency), data)
      return [reportHeaders].concat(transformedData)
    }
    return {
      csvData: dataR
        .map(assocBCHNotes(notesR.getOrElse({})))
        .map(transform)
        .getOrElse([])
    }
  }
)
const getDOTData = createSelector(
  [selectors.core.data.dot.getTransactionHistory, selectors.core.settings.getCurrency],
  (dataR, currencyR) => {
    const currency = currencyR.getOrElse('USD')
    const transform = (data) => {
      if (data) {
        const transformedData = map((tx) => formatHaskoinData(tx, 'DOT', currency), data)
        return [reportHeaders].concat(transformedData)
      }
      return []
    }
    return {
      csvData: dataR.map(transform).getOrElse([])
    }
  }
)

const getData = (state, coin) => {
  switch (coin) {
    case 'AAVE':
      return getAaveData(state)
    case 'BCH':
      return getBchData(state)
    case 'PAX':
      return getPaxData(state)
    case 'USDT':
      return getUsdtData(state)
    case 'WDGLD':
      return getWdgldData(state)
    case 'ETH':
      return getEthData(state)
    case 'XLM':
      return getXlmData(state)
    case 'YFI':
      return getYfiData(state)
    case 'DOT':
      return getDOTData(state)
    default:
      return getBtcData(state)
  }
}

export default getData
