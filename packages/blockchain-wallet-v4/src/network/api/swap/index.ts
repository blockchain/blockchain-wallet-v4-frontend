import { CoinType, FiatType, SwapPaymentMethod, SwapProfile } from '@core/types'

import {
  SwapNewQuoteType,
  SwapOrderDirectionType,
  SwapOrderStateType,
  SwapOrderType,
  SwapPaymentAccount,
  SwapQuotePriceType,
  SwapQuoteType,
  SwapUserLimitsType
} from './types'

export default ({ authorizedGet, authorizedPost, authorizedPut, nabuUrl }) => {
  const cancelSwapOrder = (id: string): SwapOrderType =>
    authorizedPost({
      contentType: 'application/json',
      data: {
        action: 'CANCEL'
      },
      endPoint: `/custodial/trades/${id}`,
      removeDefaultPostData: true,
      url: nabuUrl
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
      contentType: 'application/json',
      data: {
        ccy,
        destinationAddress,
        direction,
        quoteId,
        refundAddress,
        volume
      },
      endPoint: '/custodial/trades',
      removeDefaultPostData: true,
      url: nabuUrl
    })

  const getSwapLimits = (currency: FiatType): SwapUserLimitsType =>
    authorizedGet({
      contentType: 'application/json',
      endPoint: `/trades/limits?currency=${currency}&minor=true`,
      ignoreQueryParams: true,
      url: nabuUrl
    })

  const getSwapPairs = (): Array<string> =>
    authorizedGet({
      contentType: 'application/json',
      endPoint: `/custodial/trades/pairs`,
      ignoreQueryParams: true,
      url: nabuUrl
    })

  const getSwapTrades = (
    limit?: number,
    offset?: number,
    before?: string,
    after?: string,
    states?: string // comma-separated list of SwapOrderStateType
  ) =>
    authorizedGet({
      data: {
        after,
        before,
        limit,
        offset,
        states
      },
      endPoint: `/custodial/trades`,
      ignoreQueryParams: true,
      url: nabuUrl
    })

  const getUnifiedSwapTrades = (
    currency?: CoinType,
    limit?: number,
    before?: string,
    after?: string,
    v2states?: SwapOrderStateType
  ): Array<SwapOrderType> =>
    authorizedGet({
      data: {
        after,
        before,
        currency,
        limit,
        states: v2states
      },
      endPoint: `/trades/unified`,
      url: nabuUrl
    })

  const updateSwapOrder = (id: string, action: 'DEPOSIT_SENT' | 'CANCEL'): SwapQuoteType =>
    authorizedPost({
      contentType: 'application/json',
      data: {
        action
      },
      endPoint: `/custodial/trades/${id}`,
      url: nabuUrl
    })

  const getSwapQuotePrice = (
    pair: string,
    amount: string,
    paymentMethod: SwapPaymentMethod,
    orderProfileName: SwapProfile
  ): SwapQuotePriceType =>
    authorizedGet({
      contentType: 'application/json',
      data: {
        amount,
        currencyPair: pair,
        orderProfileName,
        paymentMethod
      },
      endPoint: `/brokerage/quote/price`,
      url: nabuUrl
    })

  const getSwapQuote = (
    pair: string,
    profile: SwapProfile,
    inputValue: string,
    paymentMethod: SwapPaymentMethod,
    paymentMethodId?: string
  ): SwapNewQuoteType =>
    authorizedPost({
      contentType: 'application/json',
      data: {
        inputValue,
        pair,
        paymentMethod,
        paymentMethodId,
        profile
      },
      endPoint: '/brokerage/quote',
      url: nabuUrl
    })

  const getPaymentAccount = (currency: CoinType): SwapPaymentAccount =>
    authorizedPut({
      contentType: 'application/json',
      data: {
        currency
      },
      endPoint: '/payments/accounts/swap',
      url: nabuUrl
    })

  return {
    cancelSwapOrder,
    createSwapOrder,
    getPaymentAccount,
    getSwapLimits,
    getSwapPairs,
    getSwapQuote,
    getSwapQuotePrice,
    getSwapTrades,
    getUnifiedSwapTrades,
    updateSwapOrder
  }
}
