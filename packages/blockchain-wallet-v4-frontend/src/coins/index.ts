import { SwapCoinType } from 'data/components/swap/types'
import { WalletCurrencyType } from 'core/types'

// TODO: organize all of this
export type CoinAccountSelectorType = {
  coins?: Array<WalletCurrencyType>
  custodialAccounts?: boolean
  importedAddresses?: boolean
  nonCustodialAccounts?: boolean
}

// used in selectors AND as coin ordering in feature
export const SWAP_COIN_ORDER: Array<SwapCoinType>  = [
  'BTC',
  'ETH',
  'BCH',
  'XLM',
  'PAX',
  'USDT',
  'WDGLD',
  'ALGO'
]

export const SWAP_SELECTOR_CONFIG: CoinAccountSelectorType = {
  coins: SWAP_COIN_ORDER,
  custodialAccounts: true,
  nonCustodialAccounts: true
}

export const REQUEST_SELECTOR_CONFIG: CoinAccountSelectorType = {
  importedAddresses: true,
  nonCustodialAccounts: true
}