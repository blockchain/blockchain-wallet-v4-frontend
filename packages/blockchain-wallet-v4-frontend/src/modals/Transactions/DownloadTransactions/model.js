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
    unit: currency,
    value: d.value_then
  }),
  fiatToString({
    unit: currency,
    value: d.value_now
  }),
  fiatToString({
    unit: currency,
    value: d.exchange_rate_then
  }),
  d.hash || d.tx,
  d.description || d.note
]

const isErc20Coin = (coin) =>
  coin === 'PAX' || coin === 'USDT' || coin === 'WDGLD' || coin === 'AAVE' || coin === 'YFI'

export { formatHaskoinData, formatTxData, isErc20Coin, reportHeaders }
