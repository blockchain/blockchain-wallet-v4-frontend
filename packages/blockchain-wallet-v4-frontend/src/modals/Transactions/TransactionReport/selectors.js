import { TXNotes, Wallet } from 'blockchain-wallet-v4/src/types'
import { assoc, curry, map, prop } from 'ramda'
import { createSelector } from 'reselect'
import { selectors } from 'data'
import {
  isValidBtcStartDate,
  isValidBchStartDate,
  isValidBtcEndDate,
  isValidBchEndDate
} from './services'

export const getData = (coin, state) => {
  switch (coin) {
    case 'BCH':
      return getBchData(state)
    case 'BTC':
      return getBtcData(state)
    default:
      return getBtcData(state)
  }
}

export const getBtcData = createSelector(
  [
    selectors.core.wallet.getWallet,
    selectors.core.data.bitcoin.getTransactionHistory,
    selectors.form.getFormValues('transactionReport')
  ],
  (wallet, dataR, formValues) => {
    const transform = data => {
      const headers = [
        'date',
        'time',
        'type',
        'amount_btc',
        'value_then',
        'value_now',
        'exchange_rate_then',
        'tx',
        'note'
      ]
      const transformedData = map(
        d => [
          d.date,
          d.time,
          d.type,
          d.amount_btc,
          d.value_then,
          d.value_now,
          d.exchange_rate_then,
          d.tx,
          d.note
        ],
        data
      )
      return [headers].concat(transformedData)
    }
    const start = prop('start', formValues)
    const end = prop('end', formValues)
    return {
      csvData: dataR
        .map(assocBTCNotes(wallet))
        .map(transform)
        .getOrElse(undefined),
      isValidStartDate: date => isValidBtcStartDate(date, end),
      isValidEndDate: date => isValidBtcEndDate(date, start),
      formValues
    }
  }
)

export const getBchData = createSelector(
  [
    selectors.core.kvStore.bch.getBchTxNotes,
    selectors.core.data.bch.getTransactionHistory,
    selectors.form.getFormValues('transactionReport')
  ],
  (notesR, dataR, formValues) => {
    const transform = data => {
      const headers = [
        'date',
        'time',
        'type',
        'amount_bch',
        'value_then',
        'value_now',
        'exchange_rate_then',
        'tx',
        'note'
      ]
      const transformedData = map(
        d => [
          d.date,
          d.time,
          d.type,
          d.amount_bch,
          d.value_then,
          d.value_now,
          d.exchange_rate_then,
          d.tx,
          d.note
        ],
        data
      )
      return [headers].concat(transformedData)
    }
    const start = prop('start', formValues)
    const end = prop('end', formValues)
    const notes = notesR.getOrElse({})
    return {
      csvData: dataR
        .map(assocBCHNotes(notes))
        .map(transform)
        .getOrElse(undefined),
      isValidStartDate: date => isValidBchStartDate(date, end),
      isValidEndDate: date => isValidBchEndDate(date, start)
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
