import { DexSwapQuoteResponse } from '@core/network/api/dex/types'
import { CoinType, RemoteDataType } from '@core/types'

export type DexToken = {
  address: string
  chainId: number
  decimals: number
  name: string
  symbol: CoinType
  verifiedBy?: number
}

export type DexChainTokenList = Array<DexToken>

export type DexChain = {
  chainId: number
  name: string
  nativeCurrency: {
    address: string
    chainId: number
    decimals: number
    name: string
    symbol: CoinType
  }
}

export type DexChainList = Array<DexChain>

export type DexStateType = {
  chains: RemoteDataType<string, DexChainList>
  currentChain: RemoteDataType<string, DexChain>
  currentChainTokens: RemoteDataType<string, DexChainTokenList>
  swapQuote: RemoteDataType<
    DexSwapQuoteResponse | { status?: string; type?: string },
    DexSwapQuoteResponse
  >
}

export type DexSwapSide = 'BASE' | 'COUNTER'
export type DexScenes = 'ONBOARDING' | 'SWAP'
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
  slippage: string
  step: DexSwapSteps
}
