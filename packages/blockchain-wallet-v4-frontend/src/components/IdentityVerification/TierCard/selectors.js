import { selectors } from 'data'

export const getData = state => {
  const userData = selectors.modules.profile.getUserData(state).getOrElse(null)
  const userTiers = selectors.modules.profile.getTiers(state).getOrElse(null)
  const emailVerified = selectors.core.settings
    .getEmailVerified(state)
    .getOrElse(false)
  const mobileVerified = selectors.core.settings
    .getSmsVerified(state)
    .getOrElse(false)
  return { userData, userTiers, emailVerified, mobileVerified }
}
