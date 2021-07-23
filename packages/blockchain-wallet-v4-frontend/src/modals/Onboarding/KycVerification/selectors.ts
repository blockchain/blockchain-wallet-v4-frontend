import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => ({
  emailVerified: selectors.core.settings.getEmailVerified(state).getOrElse(false),
  step: selectors.components.identityVerification.getVerificationStep(state),
  steps: selectors.components.identityVerification.getSteps(state)
})

export default getData
