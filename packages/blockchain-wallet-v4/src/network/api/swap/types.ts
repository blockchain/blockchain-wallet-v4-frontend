export type SwapOrderDirectionType =
  | 'INTERNAL'
  | 'ON_CHAIN'
  | 'FROM_USERKEY'
  | 'TO_USERKEY'

export type SwapQuoteType = {
  createdAt: string
  expiresAt: string
  id: string
  networkFee: string
  pair: string
  product: string
  quote: {
    currencyPair: string
    priceTiers: Array<{
      marginPrice: string
      price: string
      volume: string
    }>
  }
  sampleDepositAddress: string
  // In destination currency
  staticFee: string
  updatedAt: string
}
