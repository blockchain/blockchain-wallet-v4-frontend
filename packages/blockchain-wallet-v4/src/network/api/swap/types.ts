import { BSPaymentTypes, CoinType, FiatType } from '@core/types'
import { PlaidSettlementErrorReasons } from 'data/types'

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
  pair: PairType
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

export type PairType = string

export enum SwapOrderDirection {
  FROM_USERKEY = 'FROM_USERKEY',
  INTERNAL = 'INTERNAL',
  ON_CHAIN = 'ON_CHAIN',
  TO_USERKEY = 'TO_USERKEY'
}

/**
 * @deprecated
 */
export type SwapOrderDirectionType = keyof typeof SwapOrderDirection

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
  max: string
  maxOrder: string
  maxPossibleOrder: string
  min: string
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
  pair: PairType
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

export type SwapQuoteStateType = { quote: SwapQuoteType; rate: number }

export enum SwapProfile {
  SWAP_FROM_USERKEY = 'SWAP_FROM_USERKEY',
  SWAP_INTERNAL = 'SWAP_INTERNAL',
  SWAP_ON_CHAIN = 'SWAP_ON_CHAIN',
  SWAP_TO_USERKEY = 'SWAP_TO_USERKEY'
}

export type SwapQuotePriceType = {
  amount: string
  currencyPair: PairType
  dynamicFee: string // USD
  networkFee: string
  orderProfileName: SwapProfile
  paymentMethod: BSPaymentTypes
  price: string
  resultAmount: string // BTC f=(amount-dynamicFee)*price - networkFee
}

export type SwapNewQuoteType = {
  feeDetails: {
    fee: string
    feeFlags: []
    feeWithoutPromo: string
  }
  id: string
  networkFee: string | null
  price: string
  quoteCreatedAt: string
  quoteExpiresAt: string
  quoteId: string
  quoteMarginPercent: number
  resultAmount: string
  sampleDepositAddress: string
  settlementDetails: {
    availability: string
    reason: PlaidSettlementErrorReasons
  }
  staticFee: string | null
}

export type RefreshConfig = {
  date: Date
  totalMs: number
}

export type SwapNewQuoteStateType = SwapNewQuoteType & {
  price: StandardNumericString
  refreshConfig: RefreshConfig
  resultAmount: StandardNumericString
}

export enum SwapPaymentMethod {
  Deposit = 'DEPOSIT',
  Funds = 'FUNDS'
}

type AgentType = {
  address?: string
  main?: string
}

export type SwapPaymentAccount = {
  address: string
  agent: AgentType
  currency: CoinType
  id: string
  partner: string
  state: string
}
