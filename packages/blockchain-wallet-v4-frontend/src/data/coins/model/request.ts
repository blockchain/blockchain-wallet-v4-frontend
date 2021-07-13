import { CoinAccountSelectorType } from 'data/coins/types'

// used in the coin/account selector in request flyout (modals/RequestCrypto)
export const REQUEST_ACCOUNTS_SELECTOR: CoinAccountSelectorType = {
  importedAddresses: true,
  nonCustodialAccounts: true,
  tradingAccounts: true
}
