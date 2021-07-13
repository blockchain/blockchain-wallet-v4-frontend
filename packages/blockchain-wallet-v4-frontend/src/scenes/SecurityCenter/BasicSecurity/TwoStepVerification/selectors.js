import { lift } from 'ramda'

import { selectors } from 'data'

export const getData = state => {
  const authType = selectors.core.settings.getAuthType(state)
  const smsNumber = selectors.core.settings.getSmsNumber(state)
  const smsVerified = selectors.core.settings.getSmsVerified(state)

  const f = (a, n, v) => ({
    authType: parseInt(a),
    smsNumber: n,
    smsVerified: v
  })

  return lift(f)(authType, smsNumber, smsVerified)
}
