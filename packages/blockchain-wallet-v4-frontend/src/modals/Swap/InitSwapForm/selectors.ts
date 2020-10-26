import { RootState } from 'data/rootReducer'

import { selectors } from 'data'

export const getData = (state: RootState) => {
  const accounts = selectors.components.swap.getActiveAccounts(state)
  return { accounts }
}
