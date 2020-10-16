export type SwapOrderType = {
  createdAt: string
  id: string
  kind: {
    // Optional fields depending on direction
    depositAddress: string
    depositTxHash: string
    direction: SwapOrderDirectionType
    withdrawalAddress: string
    withdrawalTxHash: string
  }
  priceFunnel: {
    inputMoney: string
    networkFee: string
    outputMoney: string
    price: string
    staticFee: string
  }
  quote: SwapQuoteType
  state: SwapOrderStateType
  updatedAt: string
}

export type SwapOrderDirectionType =
  | 'INTERNAL'
  | 'ON_CHAIN'
  | 'FROM_USERKEY'
  | 'TO_USERKEY'

export type SwapOrderStateType =
  | 'PENDING_EXECUTION'
  | 'PENDING_DEPOSIT'
  | 'FINISH_DEPOSIT'
  | 'PENDING_WITHDRAWAL'
  | 'EXPIRED'
  | 'FINISHED'
  | 'FAILED'

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
