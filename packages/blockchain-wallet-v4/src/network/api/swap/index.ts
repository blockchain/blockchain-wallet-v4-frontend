import { SwapOrderDirectionType, SwapOrderType, SwapQuoteType } from './types'

export default ({ authorizedPost, nabuUrl }) => {
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
    getSwapQuote
  }
}
