import { lift, not } from 'ramda'

import { selectors } from 'data'

export const getData = state => {
  const isEmailVerifiedR = selectors.core.settings.getEmailVerified(state)
  const isMobileVerifiedR = selectors.core.settings.getSmsVerified(state)

  const transform = (isEmailVerified, isMobileVerified) => ({
    emailDisabled: not(isEmailVerified),
    mobileDisabled: not(isMobileVerified)
  })

  return lift(transform)(isEmailVerifiedR, isMobileVerifiedR)
}
