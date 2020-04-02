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

export { formatTxData, reportHeaders }
