import { CoinAccountSelectorType } from 'data/coins/types'

// used in transaction list dropdown
export const ALL_ACCOUNTS_SELECTOR: CoinAccountSelectorType = {
  importedAddresses: true,
  tradingAccounts: true,
  interestAccounts: true,
  nonCustodialAccounts: true
}
