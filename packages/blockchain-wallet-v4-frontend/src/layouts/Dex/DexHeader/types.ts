export type PrimaryNavKeys = 'home' | 'prices' | 'earn' | 'nfts' | 'dex'
export type AccountNavKeys =
  | 'general'
  | 'security'
  | 'preferences'
  | 'wallets-addresses'
  | 'tax-center'
  | 'refer-friend'
  | 'trading-limits'
  | 'sign-out'

export type PrimaryNavItem = {
  dot?: boolean
  key: PrimaryNavKeys
  label: string
}

export type AccountNavItems = {
  key: AccountNavKeys
  label: string
}
