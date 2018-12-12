import { lift } from 'ramda'

import { selectors } from 'data'

export const getData = state => {
  const transform = (userData, userTiers) => ({ userData, userTiers })
  const userDataR = selectors.modules.profile.getUserData(state)
  const userTiersR = selectors.modules.profile.getTiers(state)
  const data = lift(transform)(userDataR, userTiersR)
  return { data }
}
