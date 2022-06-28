import { CoinType, RemoteDataType } from '@core/types'

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
}
