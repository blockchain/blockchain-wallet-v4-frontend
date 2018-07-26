import { path } from 'ramda'
import { selectors } from 'data'

export const getStep = path(['components', 'identityVerification', 'step'])
export const getPersonalStep = path([
  'components',
  'identityVerification',
  'personalStep'
])
export const getEmailStep = path([
  'components',
  'identityVerification',
  'emailStep'
])
export const getSmsStep = path([
  'components',
  'identityVerification',
  'smsStep'
])
export const getFormBusy = path([
  'components',
  'identityVerification',
  'formBusy'
])
export const getPersonalData = state => ({
  email: selectors.core.settings.getEmail(state).getOrElse(''),
  smsNumber: selectors.core.settings.getSmsNumber(state).getOrElse(''),
  emailVerified: selectors.core.settings.getEmailVerified(state).getOrElse(0),
  smsVerified: selectors.core.settings.getSmsVerified(state).getOrElse(0)
})
