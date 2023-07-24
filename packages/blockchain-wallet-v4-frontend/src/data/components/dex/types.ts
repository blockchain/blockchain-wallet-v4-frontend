import { BigNumber } from 'ethers'

import type { DexChain, DexSwapQuote } from '@core/network/api/dex'
import { CoinType, RemoteDataType } from '@core/types'

export type ParsedTx = {
  chainId: string
  data: string
  gasLimit: string
  gasPrice: string
  nonce: number
  to: string
  value: string
}

export type SwapQuoteSuccess = {
  tx: string
}

export type DexSwapQuoteWithDate = DexSwapQuote & {
  date: Date
  totalMs: number
}

export enum DexPosition {
  DESTINATION = 'DESTINATION',
  SOURCE = 'SOURCE'
}

export enum DexSwapSide {
  BASE = 'BASE',
  COUNTER = 'COUNTER'
}

export enum DexSwapSideFields {
  BASE = 'baseToken',
  COUNTER = 'counterToken'
}

export enum DexSwapSteps {
  COMPLETE_SWAP = 'COMPLETE_SWAP',
  CONFIRM_SWAP = 'CONFIRM_SWAP',
  EMPTY_BALANCES = 'EMPTY_BALANCES',
  ENTER_DETAILS = 'ENTER_DETAILS',
  NO_TOKEN_BALANCES = 'NO_TOKEN_BALANCES'
}

// TODO: Handle errors types when the new BE driven errors will be delivered
export type DexStateType = {
  chains: RemoteDataType<string, DexChain[]>
  currentChain: RemoteDataType<string, DexChain>
  isTokenAllowed: RemoteDataType<string, boolean>
  isTokenAllowedAfterPolling: RemoteDataType<string, boolean>
  isUserEligible: RemoteDataType<string, boolean>
  swapQuote: RemoteDataType<QuoteError, DexSwapQuoteWithDate>
  swapQuoteTx: RemoteDataType<string, SwapQuoteSuccess>
  swapSideType: DexSwapSide
  tokenAllowanceGasEstimate: string
  tokenAllowanceTx: RemoteDataType<string, ParsedTx>
  tokens: DexToken[]
}

export type DexScenes = 'ERROR' | 'LOADING' | 'NOT_ELIGIBLE' | 'ONBOARDING' | 'SWAP'

export type QuoteError = {
  message: string
  title: string
}

export type DexSwapForm = {
  baseToken?: CoinType
  baseTokenAmount?: number
  counterToken?: CoinType
  counterTokenAmount?: number
  isFlipping: boolean
  slippage: number
  step: DexSwapSteps
}

export type DexToken = {
  address: string
  balance: BigNumber
  fiatAmount: number
  name: string
  precision: number
  symbol: CoinType
}
