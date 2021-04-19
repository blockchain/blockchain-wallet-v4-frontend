import { lift } from 'ramda'

import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const defaultMethodR = selectors.components.brokerage.getAccount(state)

  return lift(defaultMethod => ({
    defaultMethod
  }))(defaultMethodR)
}
