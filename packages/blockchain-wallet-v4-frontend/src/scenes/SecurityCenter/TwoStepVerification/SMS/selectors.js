import { selectors } from 'data'
import { lift } from 'ramda'

export const getData = state => {
  const authType = selectors.core.settings.getAuthType(state)
  const smsNumber = selectors.core.settings.getSmsNumber(state)
  const smsVerified = selectors.core.settings.getSmsVerified(state)
  const countryCode = selectors.core.settings.getCountryCode(state)

  const f = (a, n, v, c) => ({ authType: parseInt(a), smsNumber: n, smsVerified: v, countryCode: c })

  return lift(f)(authType, smsNumber, smsVerified, countryCode)
}
