import { path } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const smsVerified = selectors.core.settings.getSmsVerified(state).getOrElse(0)
  return {
    helperDomain: path(
      ['walletOptionsPath', 'data', 'domains', 'walletHelper'],
      state
    ),
    smsVerified,
    step: selectors.components.identityVerification.getVerificationStep(state),
    path: selectors.router.getPathname(state)
  }
}
