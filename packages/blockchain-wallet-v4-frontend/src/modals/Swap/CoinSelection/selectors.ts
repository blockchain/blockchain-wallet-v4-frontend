import { RootState } from 'data/rootReducer'

import { selectors } from 'data'
import { SwapCoinType } from 'data/components/swap/types'

export const coinOrder: Array<SwapCoinType> = [
  'BTC',
  'ETH',
  'BCH',
  'XLM',
  'PAX',
  'USDT',
  'ALGO'
]

export const getData = (state: RootState) => {
  const accounts = selectors.components.swap.getActiveAccounts(state)
  return { accounts }
}
