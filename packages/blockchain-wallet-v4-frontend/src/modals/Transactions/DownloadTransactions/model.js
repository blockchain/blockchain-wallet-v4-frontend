import { fiatToString } from 'blockchain-wallet-v4/src/exchange/currency'

const reportHeaders = [
  'date',
  'time',
  'token',
  'type',
  'amount',
  'value_then',
  'value_now',
  'exchange_rate_then',
  'tx',
  'note'
]

const formatTxData = (d, coin) => [
  d.date,
  d.time,
  coin,
  d.type,
  d.amount || d.amount_btc || d.amount_bch,
  d.value_then,
  d.value_now,
  d.exchange_rate_then,
  d.hash || d.tx,
  d.description || d.note
]

// haskoin returns data differently fiat values in
// scientific notation, we need to format it for
// tx report
const formatHaskoinData = (d, coin, currency) => [
  d.date,
  d.time,
  coin,
  d.type,
  d.amount || d.amount_btc || d.amount_bch,
  fiatToString({
    value: d.value_then,
    unit: currency
  }),
  fiatToString({
    value: d.value_now,
    unit: currency
  }),
  fiatToString({
    value: d.exchange_rate_then,
    unit: currency
  }),
  d.hash || d.tx,
  d.description || d.note
]

export { formatHaskoinData, formatTxData, reportHeaders }
