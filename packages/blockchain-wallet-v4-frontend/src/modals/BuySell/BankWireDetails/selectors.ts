import { lift } from 'ramda'

import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const accountR = selectors.components.buySell.getBSAccount(state)
  const userDataR = selectors.modules.profile.getUserData(state)
  const orderR = selectors.components.buySell.getBSOrder(state)

  return lift((account, userData, order) => ({ account, order, userData }))(
    accountR,
    userDataR,
    orderR
  )
}
