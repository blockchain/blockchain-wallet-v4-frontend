import { CoinAccountSelectorType } from 'data/coins/types'

// used in the coin/account selector in request flyout (modals/RequestCrypto)
export const REQUEST_ACCOUNTS_SELECTOR: CoinAccountSelectorType = {
  importedAddresses: true,
  nonCustodialAccounts: true,
  tradingAccounts: true
}

// used for when we want to hide imported addresses
export const REQUEST_ACCOUNTS_SELECTOR_NO_IMPORTED: CoinAccountSelectorType = {
  importedAddresses: false,
  nonCustodialAccounts: true,
  tradingAccounts: true
}
