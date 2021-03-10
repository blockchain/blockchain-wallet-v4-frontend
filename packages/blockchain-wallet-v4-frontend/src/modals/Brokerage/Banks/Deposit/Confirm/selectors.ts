import { lift } from 'ramda'

import { selectors } from 'data'

export const getData = state => {
  const defaultMethodR = selectors.components.brokerage.getAccount(state)

  return lift(defaultMethod => ({
    defaultMethod
  }))(defaultMethodR)
}
