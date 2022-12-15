// TODO: Split this file into domains
import { CoinType } from '@core/types'

// single only is supported now
export type DexVenueName = 'ZEROX'
export type DexVenueType = 'AGGREGATOR'
export type DexSwapQuoteType = 'SINGLE'

type DexTokenCommon = {
  address: string
  chainId: number
  decimals: number
  name: string
  symbol: CoinType
}

export type DexTokenNative = DexTokenCommon & {
  type: 'NATIVE'
}

export type DexTokenNotNative = DexTokenCommon & {
  type: 'NOT_NATIVE'
  verifiedBy: number
}

export type DexToken = DexTokenNative | DexTokenNotNative

export type DexChain = {
  chainId: number
  name: string
  nativeCurrency: DexTokenNative
}

type DexAmountCommon = {
  address: string
  amount: number
  chainId: number
  symbol: CoinType
}

export type DexBuyAmount = DexAmountCommon & {
  minAmount: number
  type: 'BUY'
}

export type DexSellAmount = DexAmountCommon & {
  type: 'SELL'
}

export type DexQuote = {
  buyAmount: DexBuyAmount
  buyTokenFee: number
  buyTokenPercentageFee: number
  guaranteedPrice: number
  price: number
  sellAmount: DexSellAmount
}

export type DexTransaction = {
  allowanceTarget: string
  chainId: number
  data: string
  gasLimit: number
  gasPrice: number
  to: string
  value: number
}

export type DexSwapQuote = {
  // now we support single only so its 1
  legs: 1
  quote: DexQuote
  transaction: DexTransaction
  type: DexSwapQuoteType
  venueType: DexVenueType
}
