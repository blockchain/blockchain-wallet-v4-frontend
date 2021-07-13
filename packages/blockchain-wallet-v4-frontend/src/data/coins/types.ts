import { WalletCurrencyType } from 'blockchain-wallet-v4/src/types'

export type CoinAccountSelectorType = {
  coins?: Array<WalletCurrencyType>
  importedAddresses?: boolean
  interestAccounts?: boolean
  nonCustodialAccounts?: boolean
  tradingAccounts?: boolean
}
