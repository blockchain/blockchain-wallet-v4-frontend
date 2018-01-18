import { selectors } from 'data'
import { lift } from 'ramda'

// getData :: state -> Remote( [smsNumber, smsVerified ])
export const getData = state => {
  const smsNumber = selectors.core.settings.getSmsNumber(state)
  const smsVerified = selectors.core.settings.getSmsVerified(state)
  const f = (s, v) => ({ smsNumber: s, smsVerified: v })

  return lift(f)(smsNumber, smsVerified)
}
