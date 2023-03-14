import { CoinAccountSelectorType } from 'data/coins/types'

// used in the coin/account selector in send flyout (modals/SendCrypto)
export const SEND_ACCOUNTS_SELECTOR: CoinAccountSelectorType = {
  importedAddresses: true,
  nonCustodialAccounts: true,
  tradingAccounts: true
}
