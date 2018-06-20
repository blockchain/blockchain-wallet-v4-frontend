import { createSelector } from 'reselect'
import { map, prop } from 'ramda'
import { selectors } from 'data'
import { isValidBtcStartDate, isValidBchStartDate, isValidBtcEndDate, isValidBchEndDate } from './services'

export const getData = (coin, state) => {
  switch (coin) {
    case 'BCH': return getBchData(state)
    case 'BTC': return getBtcData(state)
    default: return getBtcData(state)
  }
}

export const getBtcData = createSelector(
  [
    selectors.core.data.bitcoin.getTransactionHistory,
    selectors.form.getFormValues('transactionReport')
  ],
  (dataR, formValues) => {
    const transform = data => {
      const headers = ['date', 'time', 'status', 'amount_btc', 'value_then', 'value_now', 'exchange_rate_then', 'tx']
      const transformedData = map(d => [d.date, d.time, d.type, d.amount_btc, d.value_then, d.value_now, d.exchange_rate_then, d.tx], data)
      return [headers].concat(transformedData)
    }
    const start = prop('start', formValues)
    const end = prop('end', formValues)
    return {
      csvData: dataR.map(transform).getOrElse(undefined),
      isValidStartDate: (date) => isValidBtcStartDate(date, end),
      isValidEndDate: (date) => isValidBtcEndDate(date, start)
    }
  }
)

export const getBchData = createSelector(
  [
    selectors.core.data.bch.getTransactionHistory,
    selectors.form.getFormValues('transactionReport')
  ],
  (dataR, formValues) => {
    const transform = data => {
      const headers = ['date', 'time', 'status', 'amount_bch', 'value_then', 'value_now', 'exchange_rate_then', 'tx']
      const transformedData = map(d => [d.date, d.time, d.type, d.amount_bch, d.value_then, d.value_now, d.exchange_rate_then, d.tx], data)
      return [headers].concat(transformedData)
    }
    const start = prop('start', formValues)
    const end = prop('end', formValues)
    return {
      csvData: dataR.map(transform).getOrElse(undefined),
      isValidStartDate: (date) => isValidBchStartDate(date, end),
      isValidEndDate: (date) => isValidBchEndDate(date, start)
    }
  }
)
