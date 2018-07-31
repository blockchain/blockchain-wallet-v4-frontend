import { compose, path } from 'ramda'
import { selectors } from 'data'
import { STEPS } from 'data/components/identityVerification/model'
import { USER_ACTIVATION_STATES, KYC_STATES } from 'data/modules/profile/model'

const deriveStep = ({ activationState, kycState }) => {
  if (activationState === USER_ACTIVATION_STATES.NONE) return STEPS.personal
  if (activationState === USER_ACTIVATION_STATES.CREATED) return STEPS.address
  if (
    activationState === USER_ACTIVATION_STATES.ACTIVE &&
    kycState === KYC_STATES.NONE
  )
    return STEPS.verify
  return null
}
export const getData = state => ({
  helperDomain: path(
    ['walletOptionsPath', 'data', 'domains', 'walletHelper'],
    state
  ),
  step: compose(
    deriveStep,
    state => ({
      activationState: selectors.modules.profile.getUserActivationState(state),
      kycState: selectors.modules.profile.getUserKYCState(state)
    })
  )(state)
})
