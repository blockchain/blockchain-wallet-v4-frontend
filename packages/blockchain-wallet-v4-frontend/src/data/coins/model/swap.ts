import { CoinType } from 'blockchain-wallet-v4/src/types'
import { CoinAccountSelectorType } from 'data/coins/types'

// master list of coins supported by Swap
// the order of the determines the order in which coins are shown to the user
export const SUPPORTED_COINS: Array<CoinType | string> = [
  'BTC',
  'ETH',
  'BCH',
  'YFI',
  'DOT',
  'XLM',
  'ALGO'
]

// used in the coin/account selector in Swap
export const SWAP_ACCOUNTS_SELECTOR: CoinAccountSelectorType = {
  nonCustodialAccounts: true,
  tradingAccounts: true
}
