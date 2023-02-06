import { PubkeyServiceSubscriptions } from '@core/network/api/coins/types'
import { RemoteDataType } from '@core/types'

export type CoinAccountSelectorType = {
  coins?: Array<string>
  importedAddresses?: boolean
  interestAccounts?: boolean
  nonCustodialAccounts?: boolean
  tradingAccounts?: boolean
}

export type CoinsStateType = {
  subscriptions: RemoteDataType<string, PubkeyServiceSubscriptions>
}
