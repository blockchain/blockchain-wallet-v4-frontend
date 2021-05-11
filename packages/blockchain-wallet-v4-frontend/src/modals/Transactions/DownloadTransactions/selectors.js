import { assoc, curry, map, prop } from 'ramda'
import { createSelector } from 'reselect'

import { TXNotes, Wallet } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

import { formatHaskoinData, formatTxData, reportHeaders } from './model'

export const getData = (state, coin) => {
  switch (coin) {
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
    default:
      return getBtcData(state)
  }
}

const getXlmData = createSelector(
  [selectors.core.data.xlm.getTransactionHistory],
  dataR => {
    const transform = data => {
      const transformedData = map(tx => formatTxData(tx, 'XLM'), data)
      return [reportHeaders].concat(transformedData)
    }
    return {
      csvData: dataR.map(transform).getOrElse([])
    }
  }
)

const getPaxData = createSelector(
  [state => selectors.core.data.eth.getErc20TransactionHistory(state, 'pax')],
  dataR => {
    const transform = data => {
      const transformedData = map(tx => formatTxData(tx, 'USD-D'), data)
      return [reportHeaders].concat(transformedData)
    }
    return {
      csvData: dataR.map(transform).getOrElse([])
    }
  }
)
const getUsdtData = createSelector(
  [state => selectors.core.data.eth.getErc20TransactionHistory(state, 'usdt')],
  dataR => {
    const transform = data => {
      const transformedData = map(tx => formatTxData(tx, 'USDT'), data)
      return [reportHeaders].concat(transformedData)
    }
    return {
      csvData: dataR.map(transform).getOrElse([])
    }
  }
)
const getWdgldData = createSelector(
  [state => selectors.core.data.eth.getErc20TransactionHistory(state, 'wdgld')],
  dataR => {
    const transform = data => {
      const transformedData = map(tx => formatTxData(tx, 'WDGLD'), data)
      return [reportHeaders].concat(transformedData)
    }
    return {
      csvData: dataR.map(transform).getOrElse([])
    }
  }
)

const getEthData = createSelector(
  [selectors.core.data.eth.getTransactionHistory],
  dataR => {
    const transform = data => {
      const transformedData = map(tx => formatTxData(tx, 'ETH'), data)
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
  (wallet, currencyR, dataR) => {
    const currency = currencyR.getOrElse('USD')
    const transform = data => {
      const transformedData = map(
        tx => formatHaskoinData(tx, 'BTC', currency),
        data
      )
      return [reportHeaders].concat(transformedData)
    }
    return {
      csvData: dataR
        .map(assocBTCNotes(wallet))
        .map(transform)
        .getOrElse([])
    }
  }
)

const getBchData = createSelector(
  [
    selectors.core.kvStore.bch.getBchTxNotes,
    selectors.core.settings.getCurrency,
    selectors.core.data.bch.getTransactionHistory
  ],
  (notesR, currencyR, dataR) => {
    const currency = currencyR.getOrElse('USD')
    const transform = data => {
      const transformedData = map(
        tx => formatHaskoinData(tx, 'BCH', currency),
        data
      )
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

const assocBTCNotes = curry((wallet, transactions) => {
  return transactions.map(transaction => {
    const hash = prop('tx', transaction)
    const note = TXNotes.selectNote(hash, Wallet.selectTxNotes(wallet))
    return note ? assoc('note', note, transaction) : transaction
  })
})

const assocBCHNotes = curry((notes, transactions) => {
  return transactions.map(transaction => {
    const hash = prop('tx', transaction)
    const note = notes && notes[hash]
    return note ? assoc('note', note, transaction) : transaction
  })
})
