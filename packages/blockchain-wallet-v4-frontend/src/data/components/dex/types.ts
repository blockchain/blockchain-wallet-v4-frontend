import type { DexChain, DexSwapQuote, DexToken } from '@core/network/api/dex'
import { CoinType, RemoteDataType } from '@core/types'

export type ParsedTx = {
  chainId: number
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

// TODO: Handle errors types when the new BE driven errors will be delivered
export type DexStateType = {
  chainTokens: RemoteDataType<string, DexToken[]>
  chains: RemoteDataType<string, DexChain[]>
  currentChain: RemoteDataType<string, DexChain>
  isTokenAllowed: RemoteDataType<string, boolean>
  isTokenAllowedAfterPolling: RemoteDataType<string, boolean>
  isUserEligible: RemoteDataType<string, boolean>
  swapQuote: RemoteDataType<QuoteError, DexSwapQuoteWithDate>
  swapQuoteTx: RemoteDataType<string, SwapQuoteSuccess>
  tokenAllowanceGasEstimate: string
  tokenAllowanceTx: RemoteDataType<string, ParsedTx>
}

export type DexSwapSide = 'BASE' | 'COUNTER'
export type DexScenes = 'ONBOARDING' | 'SWAP' | 'NOT_ELIGIBLE' | 'ERROR' | 'LOADING'
export type DexSwapSteps = 'COMPLETE_SWAP' | 'CONFIRM_SWAP' | 'ENTER_DETAILS'
export enum DexSwapSideFields {
  BASE = 'baseToken',
  COUNTER = 'counterToken'
}

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
