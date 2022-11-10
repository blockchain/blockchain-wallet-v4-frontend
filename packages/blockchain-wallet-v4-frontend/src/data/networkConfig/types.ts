import { RemoteDataType } from '@core/remote/types'

export enum NetworkType {
  EVM = 'EVM'
}

export type NetworkConfig = {
  networks: {
    nativeAsset: string
    type: NetworkType | string
  }[]
}

export type NetworkConfigState = {
  config: RemoteDataType<null, NetworkConfig>
}
