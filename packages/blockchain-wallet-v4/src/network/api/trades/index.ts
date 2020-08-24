import { CustodialOrderDirectionType } from './types'
import isObject from 'isobject'

import { SwapExchangeQuoteType } from 'data/modules/rates/types'

export default ({ nabuUrl, post, put, get }) => {
  const executeTrade = (
    quote: SwapExchangeQuoteType,
    refundAddress?: string,
    destinationAddress?: string,
    direction?: CustodialOrderDirectionType | null
  ) =>
    post({
      url: nabuUrl,
      endPoint: direction ? `/custodial/trades` : `/trades`,
      data: {
        quote,
        direction,
        destinationAddress,
        refundAddress
      },
      contentType: 'application/json',
      ignoreQueryParams: true
    })

  const fetchTrade = id =>
    get({
      url: nabuUrl,
      endPoint: `/trades/${id}`,
      contentType: 'application/json',
      ignoreQueryParams: true
    })

  const fetchTrades = (limit, userFiatCurrency, before = null) => {
    const data = { limit, userFiatCurrency, before }
    if (before) data.before = before
    return get({
      url: nabuUrl,
      endPoint: '/trades',
      data,
      contentType: 'application/json'
    })
  }

  const fetchLimits = currency =>
    get({
      url: nabuUrl,
      endPoint: `/trades/limits?currency=${currency}`,
      contentType: 'application/json',
      ignoreQueryParams: true
    })

  const fetchTradeCounterFees = currency =>
    get({
      url: nabuUrl,
      endPoint: `/fees/${currency}`,
      contentType: 'application/json',
      ignoreQueryParams: true
    })

  const failTrade = (tradeId, err, txHash = null) => {
    let failureReason: null | { message: string } = null
    if (typeof err === 'string') failureReason = { message: err }
    if (isObject(err)) failureReason = err
    if (err instanceof Error) failureReason = { message: err.message }
    return put({
      url: nabuUrl,
      endPoint: `/trades/${tradeId}/failure-reason`,
      contentType: 'application/json',
      data: {
        txHash,
        failureReason
      }
    })
  }

  const requestTradeHistory = () => {
    return get({
      url: nabuUrl,
      endPoint: '/trades/trade-history-csv'
    })
  }

  return {
    executeTrade,
    failTrade,
    fetchLimits,
    fetchTrade,
    fetchTrades,
    fetchTradeCounterFees,
    requestTradeHistory
  }
}
