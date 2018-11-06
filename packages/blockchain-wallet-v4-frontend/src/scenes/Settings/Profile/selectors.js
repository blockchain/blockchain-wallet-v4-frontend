import { lift } from 'ramda'

import { selectors } from 'data'

export const getData = state => {
  const transform = kycState => ({ kycState })
  const data = lift(transform)(selectors.modules.profile.getUserKYCState(state))
  return { data }
}
