import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const accountR = selectors.components.simpleBuy.getSBAccount(state)
  const userDataR = selectors.modules.profile.getUserData(state)

  return lift((account, userData) => ({ account, userData }))(
    accountR,
    userDataR
  )
}
