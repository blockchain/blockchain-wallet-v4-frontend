import { path } from 'ramda'
import { selectors, model } from 'data'
const { STEPS } = model.components.identityVerification
const { USER_ACTIVATION_STATES } = model.profile

const deriveStep = ({ activationState, smsVerified }) => {
  if (activationState === USER_ACTIVATION_STATES.ACTIVE) {
    if (smsVerified) return STEPS.verify
    return STEPS.mobile
  }
  return STEPS.personal
}

export const getData = state => {
  const smsVerified = selectors.core.settings.getSmsVerified(state).getOrElse(0)
  const activationState = selectors.modules.profile.getUserActivationState(
    state
  )
  return {
    helperDomain: path(
      ['walletOptionsPath', 'data', 'domains', 'walletHelper'],
      state
    ),
    smsVerified,
    step: deriveStep({ activationState, smsVerified })
  }
}
