import { createSelector } from 'reselect'
import { selectors } from 'data'
import { map } from 'ramda'

export const getBtcData = createSelector(
  [selectors.core.data.bitcoin.getTransactionHistory],
  (dataR) => {
    const transform = data => {
      const headers = ['date', 'time', 'status', 'amount_btc', 'value_then', 'value_now', 'exchange_rate_then', 'tx']
      const transformedData = map(d => [d.date, d.time, d.type, d.amount_btc, d.value_then, d.value_now, d.exchange_rate_then, d.tx], data)
      return [headers].concat(transformedData)
    }

    return dataR.map(transform).getOrElse(undefined)
  }
)

export const getBchData = createSelector(
  [selectors.core.data.bch.getTransactionHistory],
  (dataR) => {
    const transform = data => {
      const headers = ['date', 'time', 'status', 'amount_bch', 'value_then', 'value_now', 'exchange_rate_then', 'tx']
      const transformedData = map(d => [d.date, d.time, d.type, d.amount_bch, d.value_then, d.value_now, d.exchange_rate_then, d.tx], data)
      return [headers].concat(transformedData)
    }

    return dataR.map(transform).getOrElse(undefined)
  }
)
