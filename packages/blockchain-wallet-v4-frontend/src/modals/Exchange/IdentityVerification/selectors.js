import { path } from 'ramda'
import { selectors } from 'data'

export const getData = state => ({
  helperDomain: path(
    ['walletOptionsPath', 'data', 'domains', 'walletHelper'],
    state
  ),
  step: selectors.components.identityVerification.getVerificationStep(state),
  steps: selectors.components.identityVerification.getSteps(state)
})
