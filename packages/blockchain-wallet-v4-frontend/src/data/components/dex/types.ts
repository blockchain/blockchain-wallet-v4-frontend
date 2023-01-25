import type { DexChain, DexSwapQuote, DexToken } from '@core/network/api/dex'
import { CoinType, RemoteDataType } from '@core/types'

type CurrentChainTokensMeta = {
  count: number
  status: 'LOADING_MORE' | 'LOADED' | 'NO_MORE_TOKENS'
}

// TODO: Handle errors types when the new BE driven errors will be delivered
export type DexStateType = {
  chains: RemoteDataType<string, DexChain[]>
  currentChain: RemoteDataType<string, DexChain>
  currentChainTokens: RemoteDataType<string, DexToken[]>
  currentChainTokensMeta: CurrentChainTokensMeta
  isUserEligible: RemoteDataType<string, boolean>
  swapQuote: RemoteDataType<string, DexSwapQuote>
}

export type DexSwapSide = 'BASE' | 'COUNTER'
export type DexScenes = 'ONBOARDING' | 'SWAP' | 'NOT_ELIGIBLE' | 'ERROR' | 'LOADING'
export type DexSwapSteps = 'CONFIRM_SWAP' | 'ENTER_DETAILS'
export enum DexSwapSideFields {
  BASE = 'baseToken',
  COUNTER = 'counterToken'
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
