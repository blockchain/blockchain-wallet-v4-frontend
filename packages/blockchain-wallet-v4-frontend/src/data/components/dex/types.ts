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
  swapQuote: RemoteDataType<string, DexSwapQuoteResponse>
}

export enum DexSwapSideEnum {
  BASE = 'baseToken',
  COUNTER = 'counterToken'
}

export enum DexSwapSteps {
  CONFIRM_SWAP = 'CONFIRM_SWAP',
  ENTER_DETAILS = 'ENTER_DETAILS'
}

export type DexSwapForm = {
  baseToken?: CoinType
  baseTokenAmount?: number | string
  counterToken?: CoinType
  counterTokenAmount?: number | string
  slippage?: string | null
  step: DexSwapSteps
}

export type DexSwapSettingsForm = {
  activeSlippage?: string | null
  customSlippage?: string
  standardSlippage?: string
}
