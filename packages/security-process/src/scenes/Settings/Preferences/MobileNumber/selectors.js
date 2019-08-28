import { selectors } from 'data'
import { lift } from 'ramda'

// getData :: state -> Remote( [smsNumber, smsVerified ])
export const getData = state => {
  const smsNumber = selectors.core.settings.getSmsNumber(state)
  const smsVerified = selectors.core.settings.getSmsVerified(state)
  const authType = selectors.core.settings.getAuthType(state)
  const f = (s, v, a) => ({ smsNumber: s, smsVerified: v, authType: a })

  return lift(f)(smsNumber, smsVerified, authType)
}
