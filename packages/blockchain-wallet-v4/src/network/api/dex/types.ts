// TODO: Split this file into domains
import type { BigNumber } from 'bignumber.js'

import type { CoinType } from '@core/types'

// single only is supported now
export type DexVenueName = 'ZEROX'
export type DexVenueType = 'AGGREGATOR'
export type DexSwapQuoteType = 'SINGLE'
export type DexSpenderType = 'ZEROX_EXCHANGE'
export type DexNetworkType = 'ETH'
export type DexFeeType = 'NORMAL'
export type DexSignatureAlgorithmType = 'secp256k1'
export type DexSourceDescriptor = 'legacy'

export type DexToken = {
  address: string
  chainId: number
  decimals: number
  name: string
  symbol: CoinType
}
export type DexTokenWithBalance = DexToken & { balance: number | BigNumber }

export type DexChain = {
  chainId: number
  name: string
  nativeCurrency: DexToken
}

type DexAmountCommon = {
  address: string
  amount: number
  chainId: number
  minAmount?: number
  symbol: CoinType
}

export type DexBuyAmount = DexAmountCommon & {
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
  gasLimit: string
  gasPrice: string
  to: string
  value: string
}

export type DexSwapQuote = {
  // now we support single only so its 1
  legs: 1
  quote: DexQuote
  quoteTtl: number
  transaction: DexTransaction
  type: DexSwapQuoteType
  venueType: DexVenueType
}

export type DexTokenAllowance = {
  result: {
    allowance: string
  }
}

export type BuildDexTxPreImage = {
  descriptor: DexSourceDescriptor
  preImage: string
  signatureAlgorithm: DexSignatureAlgorithmType
  signingKey: string
}

export type BuildDexTxRawTx = {
  payload: {
    chainId: string
    data: string
    gasLimit: string
    gasPrice: string
    nonce: number
    to: string
    value: string
  }
  version: number
}

export type BuildDexTxSummary = {
  absoluteFeeEstimate: string
  absoluteFeeMaximum: string
  relativeFee: string
}

export type BuildDexTx = {
  preImages: BuildDexTxPreImage[]
  rawTx: BuildDexTxRawTx
  summary: BuildDexTxSummary
}

type SwapTx = {
  data: string
  gasLimit: string
  value: string
}

type Intent = {
  destination: string
  fee: string
  maxVerificationVersion: number
  sources: [
    {
      descriptor: DexSourceDescriptor
      pubKey: string
      style: DexSwapQuoteType
    }
  ]
}

type TokenAllowanceIntent = Intent & {
  amount: string
  spender: DexSpenderType
  type: 'TOKEN_APPROVAL'
}

type SwapIntent = Intent & { swapTx: SwapTx; type: 'SWAP' }

export type BuildDexTxParams = {
  intent: TokenAllowanceIntent | SwapIntent
  network: DexNetworkType
}
