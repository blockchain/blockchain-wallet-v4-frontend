import { selectors } from 'data'

export const getData = state => {
  const showKycGetStarted = selectors.preferences.getShowKycGetStarted(state)
  const userVerified = selectors.modules.profile
    .isUserVerified(state)
    .getOrElse(true)

  return {
    showBanner: !showKycGetStarted && !userVerified
  }
}
