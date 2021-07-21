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

const getErc20Data = createSelector(
  [
    (state, coin) => selectors.core.data.eth.getErc20TransactionHistory(state, coin),
    (_, coin) => coin
  ],
  (dataR, coin) => {
    const transform = (data) => {
      const transformedData = map((tx) => formatTxData(tx, coin), data)
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
  (wallet, currencyR, dataR: any) => {
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

const getXlmData = createSelector([selectors.core.data.xlm.getTransactionHistory], (dataR) => {
  const transform = (data) => {
    const transformedData = map((tx) => formatTxData(tx, 'XLM'), data)
    return [reportHeaders].concat(transformedData)
  }
  return {
    // @ts-ignore
    csvData: dataR.map(transform).getOrElse([])
  }
})

export const getData = (state, coin) => {
  switch (coin) {
    case 'BTC':
      return getBtcData(state)
    case 'BCH':
      return getBchData(state)
    case 'ETH':
      return getEthData(state)
    case 'XLM':
      return getXlmData(state)
    default:
      return getErc20Data(state, coin)
  }
}

export default getData
