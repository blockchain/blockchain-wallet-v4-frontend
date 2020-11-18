import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'

import { selectors } from 'data'

export const getData = (state: RootState) => {
  const balancesR = selectors.components.simpleBuy.getSBBalances(state)

  return lift((balances: ExtractSuccess<typeof balancesR>) => ({
    balances
  }))(balancesR)
}
