import {
  IndexMultiResponseType,
  TickerResponseType,
  UnifiedBalancesResponseType
} from '@core/network/api/coins/types'
import { RatesType, RemoteDataType } from '@core/types'

// state
export type CoinsState = {
  btcTicker: RemoteDataType<string, TickerResponseType>
  isCoinDataLoaded: boolean
  rates: RemoteDataType<string, IndexMultiResponseType>
  subscriptions: RemoteDataType<string, any>
  transaction_history: { [key in string]: any }
  transactions: { [key in string]: Array<any> }
  transactions_at_bound: { [key in string]: boolean }
  unifiedBalances: RemoteDataType<string, UnifiedBalancesResponseType['currencies']>
}
