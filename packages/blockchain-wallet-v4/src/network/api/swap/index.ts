import { SwapOrderDirectionType, SwapQuoteType } from './types'

export default ({ authorizedPost, nabuUrl }) => {
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
    getSwapQuote
  }
}
