import {
  CoinType,
  RemoteDataType,
  WalletFiatType
} from 'blockchain-wallet-v4/src/types'

// TODO: type this!
export type PricesStateType = {
  current: RemoteDataType<any, any>
  previousDay: RemoteDataType<any, any>
}

export type CoinPricesRequestType = {
  coins?: Array<CoinType>
  fiatCurrency?: WalletFiatType
  timestamp?: number
}
