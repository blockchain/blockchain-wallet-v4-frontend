import { CoinType, RemoteDataType, WalletFiatType } from '@core/types'

type CoinPrice = {
  marketCap: number
  price: number
  timestamp: number
  volume24h: number
}
// TODO: type this!
export type PricesStateType = {
  current: RemoteDataType<
    any,
    {
      [key: string]: CoinPrice
    }
  >
  previousDay: RemoteDataType<
    any,
    {
      [key: string]: CoinPrice
    }
  >
}

export type CoinPricesRequestType = {
  coins?: Array<CoinType>
  fiatCurrency?: WalletFiatType
  timestamp?: number
}
