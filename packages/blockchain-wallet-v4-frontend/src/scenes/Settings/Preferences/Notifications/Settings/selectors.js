import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = (state) => {
  const isEmailVerified = selectors.core.settings.getEmailVerified(state)
  const isMobileVerified = selectors.core.settings.getSmsVerified(state)

  const mergeVerified = (isEmailVerified, isMobileVerified) => ({
    isEmailVerified,
    isMobileVerified
  })

  return lift(mergeVerified)(isEmailVerified, isMobileVerified)
}
