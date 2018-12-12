import { lift } from 'ramda'

import { selectors } from 'data'

export const getData = state => {
  const transform = userData => ({ userData })
  const data = lift(transform)(selectors.modules.profile.getUserData(state))
  return { data }
}
