import { FiatType } from 'core/types'
import {
  SwapOrderDirectionType,
  SwapOrderType,
  SwapQuoteType,
  SwapUserLimitsType
} from './types'

export default ({ authorizedGet, authorizedPost, nabuUrl }) => {
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

  return {
    createSwapOrder,
    getSwapLimits,
    getSwapQuote
  }
}
