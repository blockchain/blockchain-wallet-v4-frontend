import { TickerResponseType, UnifiedBalancesResponseType } from '@core/network/api/coins/types'
import { RatesType, RemoteDataType } from '@core/types'

// state
export type CoinsState = {
  btcTicker: RemoteDataType<string, TickerResponseType>
  isCoinDataLoaded: boolean
  rates: RemoteDataType<string, RatesType>
  transactions: { [key in string]: Array<any> }
  transactions_at_bound: { [key in string]: boolean }
  unifiedBalances: RemoteDataType<string, UnifiedBalancesResponseType['currencies']>
}
