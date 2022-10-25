import { fiatToString, formatCoin, formatFiat } from '@core/exchange/utils'

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
  'note',
  'fee_value',
  'fee_value_then',
  'recipient_received',
  'recipient_value_then',
  'value_then_raw',
  'value_now_raw',
  'exchange_rate_then_raw'
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
  d.description || d.note,
  d.fee,
  formatFiat(d.exchange_rate_then_raw * d.fee, 2),
  d.type === 'received'
    ? d.amount
    : formatCoin(Math.abs(d.amount || d.amount_btc || d.amount_bch) - Math.abs(d.fee)),
  d.type === 'received'
    ? formatFiat(d.amount * d.exchange_rate_then_raw, 2)
    : formatFiat(
        (Math.abs(d.amount || d.amount_btc || d.amount_bch) - Math.abs(d.fee)) *
          d.exchange_rate_then_raw,
        2
      ),
  formatFiat(Math.abs(d.value_then_raw), 2),
  formatFiat(Math.abs(d.value_now_raw), 2),
  d.exchange_rate_then_raw
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
  d.description || d.note,
  d.fee,
  formatFiat(d.exchange_rate_then * d.fee, 2),
  formatCoin(Math.abs(d.amount || d.amount_btc || d.amount_bch) - Math.abs(d.fee)),
  formatFiat(
    (Math.abs(d.amount || d.amount_btc || d.amount_bch) - Math.abs(d.fee)) * d.exchange_rate_then,
    2
  ),
  formatFiat(Math.abs(d.value_then), 2),
  formatFiat(Math.abs(d.value_now), 2),
  d.exchange_rate_then
]

export { formatHaskoinData, formatTxData, reportHeaders }
