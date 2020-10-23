import { FiatType } from 'core/types'
import {
  SwapOrderDirectionType,
  SwapOrderType,
  SwapQuoteType,
  SwapUserLimitsType
} from './types'

export default ({
  authorizedGet,
  authorizedPost,
  authorizedDelete,
  nabuUrl
}) => {
  const cancelSwapOrder = (id: string): SwapOrderType =>
    authorizedDelete({
      url: nabuUrl,
      endPoint: `/custodial/trades/${id}/cancel`,
      removeDefaultPostData: true,
      contentType: 'application/json'
    })

  const createSwapOrder = (
    direction: SwapOrderDirectionType,
    quoteId: string,
    volume: string,
    destinationAddress?: string
  ): SwapOrderType =>
    authorizedPost({
      url: nabuUrl,
      endPoint: '/custodial/trades',
      contentType: 'application/json',
      removeDefaultPostData: true,
      data: {
        direction,
        quoteId,
        volume,
        destinationAddress
      }
    })

  const getSwapLimits = (currency: FiatType): SwapUserLimitsType =>
    authorizedGet({
      url: nabuUrl,
      endPoint: `/trades/limits?currency=${currency}&minor=true`,
      contentType: 'application/json',
      ignoreQueryParams: true
    })

  const getSwapQuote = (
    pair: string,
    direction: SwapOrderDirectionType,
    product = 'BROKERAGE'
  ): SwapQuoteType =>
    authorizedPost({
      url: nabuUrl,
      endPoint: `/custodial/quote`,
      contentType: 'application/json',
      data: {
        direction,
        pair,
        product
      }
    })

  const getSwapTrades = (
    limit?: number,
    offset?: number,
    before?: string,
    after?: string,
    states?: string // comma-separated list of SwapOrderStateType
  ) =>
    authorizedGet({
      url: nabuUrl,
      endPoint: `/custodial/trades`,
      ignoreQueryParams: true,
      data: {
        limit,
        offset,
        before,
        after,
        states
      }
    })

  return {
    cancelSwapOrder,
    createSwapOrder,
    getSwapLimits,
    getSwapQuote,
    getSwapTrades
  }
}
