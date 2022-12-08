// TODO: Split this file into domains
import { CoinType } from '@core/types'

// single only is supported now
export type DexVenueName = 'ZEROX'
export type DexSwapQuoteType = 'SINGLE'

export type DexChainNativeCurrency = {
  address: string
  chainId: number
  decimals: number
  name: string
  symbol: CoinType
}

export type DexChain = {
  chainId: number
  name: string
  nativeCurrency: DexChainNativeCurrency
}

export type DexToken = {
  address: string
  chainId: number
  decimals: number
  name: string
  symbol: CoinType
  type: 'NATIVE' | 'NOT_NATIVE'
  verifiedBy: number
}

export type DexAmount = {
  address: string
  amount: number
  chainId: number
  minAmount: number
  symbol: CoinType
}

export type DexQuote = {
  buyAmount: DexAmount
  buyTokenFee: number
  buyTokenPercentageFee: number
  estimatedPriceImpact: number
  guaranteedPrice: number
  price: number
  sellAmount: DexAmount
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
  venue: DexVenueName
}
