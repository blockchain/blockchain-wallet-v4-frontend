import { WalletCurrencyType } from 'blockchain-wallet-v4/src/types'

export type CoinAccountSelectorType = {
  coins?: Array<WalletCurrencyType>
  custodialAccounts?: boolean
  importedAddresses?: boolean
  nonCustodialAccounts?: boolean
}
