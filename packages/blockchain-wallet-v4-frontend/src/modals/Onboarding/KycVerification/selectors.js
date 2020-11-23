import { selectors } from 'data'

export const getData = state => ({
  step: selectors.components.identityVerification.getVerificationStep(state),
  steps: selectors.components.identityVerification.getSteps(state),
  emailVerified: selectors.core.settings
    .getEmailVerified(state)
    .getOrElse(false)
})
