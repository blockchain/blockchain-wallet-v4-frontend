import { CoinAccountSelectorType } from 'data/coins/types'

// used in the coin/account selector in Swap
export const SWAP_ACCOUNTS_SELECTOR: CoinAccountSelectorType = {
  nonCustodialAccounts: true,
  tradingAccounts: true
}

export default SWAP_ACCOUNTS_SELECTOR
