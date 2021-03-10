import { CoinType, FiatType } from 'core/types'

import {
  EligibilityResponseType,
  SwapOrderDirectionType,
  SwapOrderStateType,
  SwapOrderType,
  SwapQuoteType,
  SwapUserLimitsType
} from './types'

export default ({ authorizedGet, authorizedPost, nabuUrl }) => {
  const cancelSwapOrder = (id: string): SwapOrderType =>
    authorizedPost({
      url: nabuUrl,
      endPoint: `/custodial/trades/${id}`,
      removeDefaultPostData: true,
      contentType: 'application/json',
      data: {
        action: 'CANCEL'
      }
    })

  const checkCustodialEligiblity = (): EligibilityResponseType =>
    authorizedGet({
      url: nabuUrl,
      endPoint: '/eligible/product/swap'
    })

  const createSwapOrder = (
    direction: SwapOrderDirectionType,
    quoteId: string,
    volume: string,
    ccy: FiatType,
    destinationAddress?: string,
    refundAddress?: string
  ): SwapOrderType =>
    authorizedPost({
      url: nabuUrl,
      endPoint: '/custodial/trades',
      contentType: 'application/json',
      removeDefaultPostData: true,
      data: {
        ccy,
        direction,
        quoteId,
        volume,
        destinationAddress,
        refundAddress
      }
    })

  const getSwapLimits = (currency: FiatType): SwapUserLimitsType =>
    authorizedGet({
      url: nabuUrl,
      endPoint: `/trades/limits?currency=${currency}&minor=true`,
      contentType: 'application/json',
      ignoreQueryParams: true
    })

  const getSwapPairs = (): Array<string> =>
    authorizedGet({
      url: nabuUrl,
      endPoint: `/custodial/trades/pairs`,
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

  const getUnifiedSwapTrades = (
    currency: CoinType,
    limit?: number,
    before?: string,
    after?: string,
    v2states?: SwapOrderStateType
  ): Array<SwapOrderType> =>
    authorizedGet({
      url: nabuUrl,
      endPoint: `/trades/unified`,
      data: {
        currency,
        limit,
        before,
        after,
        states: v2states
      }
    })

  const updateSwapOrder = (
    id: string,
    action: 'DEPOSIT_SENT' | 'CANCEL'
  ): SwapQuoteType =>
    authorizedPost({
      url: nabuUrl,
      endPoint: `/custodial/trades/${id}`,
      contentType: 'application/json',
      data: {
        action
      }
    })

  return {
    cancelSwapOrder,
    checkCustodialEligiblity,
    createSwapOrder,
    getSwapLimits,
    getSwapPairs,
    getSwapQuote,
    getSwapTrades,
    getUnifiedSwapTrades,
    updateSwapOrder
  }
}
