import { lift } from 'ramda'

import { selectors } from 'data'

export const getData = state => {
  const authType = selectors.core.settings.getAuthType(state)

  const f = a => ({ authType: parseInt(a) })

  return lift(f)(authType)
}
