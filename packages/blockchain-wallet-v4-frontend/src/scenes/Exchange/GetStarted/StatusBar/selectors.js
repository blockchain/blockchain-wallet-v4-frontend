import { selectors } from 'data'
import { KYC_STATES, USER_ACTIVATION_STATES } from 'data/modules/profile/model'

export const getData = state => {
  const userState = selectors.modules.profile
    .getUserActivationState(state)
    .getOrElse(null)
  const kycState = selectors.modules.profile
    .getUserKYCState(state)
    .getOrElse(null)

  if (userState === USER_ACTIVATION_STATES.NONE) {
    return { step: 'getstarted' }
  }

  switch (kycState) {
    case KYC_STATES.NONE:
      return { step: 'inprogress' }
    case KYC_STATES.PENDING:
      return { step: 'pending' }
    case KYC_STATES.UNDER_REVIEW:
      return { step: 'underreview' }
    case KYC_STATES.REJECTED:
      return { step: 'rejected' }
    default:
      return { step: 'getstarted' }
  }
}
