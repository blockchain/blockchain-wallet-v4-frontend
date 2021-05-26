import { nth, path, split, toUpper } from 'ramda'

import { CoinType, CoinTypeEnum } from 'blockchain-wallet-v4/src/types'

export const getPathname = path(['router', 'location', 'pathname'])
export const getSearch = path(['router', 'location', 'search'])
export const getCoinFromPageUrl = (state): CoinType | undefined => {
  const coin = toUpper(
    // @ts-ignore
    nth(1, split('/', path(['router', 'location', 'pathname'], state)))
  )
  return (coin in CoinTypeEnum && (coin as CoinType)) || undefined
}
