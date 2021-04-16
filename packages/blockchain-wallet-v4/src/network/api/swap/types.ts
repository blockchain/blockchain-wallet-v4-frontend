import { FiatType } from 'core/types'

export type SwapEligibilityResponseType = {
  eligible: boolean
}

export type SwapOrderType = {
  createdAt: string
  fiatCurrency: FiatType
  fiatValue: string
  id: string
  kind: {
    // Optional fields depending on direction
    depositAddress: string
    depositTxHash: string
    direction: SwapOrderDirectionType
    refundAddress: string
    withdrawalAddress: string
    withdrawalTxHash: string
  }
  pair: string
  priceFunnel: {
    indicativePrice?: string
    inputMoney: string
    networkFee: string
    outputMoney: string
    price: string
    staticFee: string
  }
  state: SwapOrderStateType
  updatedAt: string
} & (
  | {
      quote: SwapQuoteType
      version: 'V2'
    }
  | {
      quote: null
      version: 'V1'
    }
)

export type ProcessedSwapOrderType = SwapOrderType & {
  insertedAt: string
}

export type SwapOrderDirectionType =
  | 'INTERNAL'
  | 'ON_CHAIN'
  | 'FROM_USERKEY'
  | 'TO_USERKEY'

export type SwapOrderStateType =
  | 'PENDING_EXECUTION'
  | 'PENDING_CONFIRMATION'
  | 'PENDING_DEPOSIT'
  | 'FINISH_DEPOSIT'
  | 'PENDING_WITHDRAWAL'
  | 'EXPIRED'
  | 'FINISHED'
  | 'FAILED'
  | 'CANCELED'

export type SwapUserLimitsType = {
  annual: {
    available: string
    limit: string
    used: string
  }
  currency: FiatType
  daily: {
    available: string
    limit: string
    used: string
  }
  maxOrder: string
  maxPossibleOrder: string
  minOrder: string
  weekly: {
    available: string
    limit: string
    used: string
  }
}

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
