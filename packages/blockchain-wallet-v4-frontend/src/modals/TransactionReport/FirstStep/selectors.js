import { createSelector } from 'reselect'
import { selectors } from 'data'
import { map } from 'ramda'

export const getBtcData = createSelector(
  [selectors.core.data.bitcoin.getTransactionHistory],
  (dataR) => {
    const headers = ['date', 'time', 'status', 'amount_btc', 'value_then', 'value_now', 'exchange_rate_then', 'tx']
    const transform = data => [headers].concat(map(record => {
      const { date, time, type, amount_btc, value_then, value_now, exchange_rate_then, tx } = record
      return [date, time, type, amount_btc, value_then, value_now, exchange_rate_then, tx]
    }))

    return {
      data: dataR.map(transform)
    }
  }
)

export const getBchData = createSelector(
  [selectors.core.data.bch.getTransactionHistory],
  (dataR) => {
    const headers = ['date', 'time', 'status', 'amount_bch', 'value_then', 'value_now', 'exchange_rate_then', 'tx']
    const transform = data => [headers].concat(map(record => {
      const { date, time, type, amount_bch, value_then, value_now, exchange_rate_then, tx } = record
      return [date, time, type, amount_bch, value_then, value_now, exchange_rate_then, tx]
    }))

    return {
      data: dataR.map(transform)
    }
  }
)
