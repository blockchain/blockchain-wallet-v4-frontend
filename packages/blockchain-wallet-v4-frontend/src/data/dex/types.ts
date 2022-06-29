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
  currentChain?: DexChain
  currentChainTokens: RemoteDataType<string, DexChainTokenList>
}
