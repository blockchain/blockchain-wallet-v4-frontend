import { selectors } from 'data'

export const getData = state => ({
  userState: selectors.modules.profile
    .getUserActivationState(state)
    .getOrElse(null),
  kycState: selectors.modules.profile.getUserKYCState(state).getOrElse(null)
})
