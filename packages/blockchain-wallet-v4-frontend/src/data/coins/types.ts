import { WalletCurrencyType } from 'core/types'

export type CoinAccountSelectorType = {
  coins?: Array<WalletCurrencyType>
  custodialAccounts?: boolean
  importedAddresses?: boolean
  nonCustodialAccounts?: boolean
}
