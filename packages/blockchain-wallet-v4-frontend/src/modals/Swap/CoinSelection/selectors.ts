import { RootState } from 'data/rootReducer'

import { selectors } from 'data'

export const coinOrder = ['BTC', 'ETH', 'BCH', 'XLM', 'ALGO', 'PAX', 'USDT']

export const getData = (state: RootState) => {
  const accounts = selectors.components.swap.getActiveAccounts(state)
  return { accounts }
}
