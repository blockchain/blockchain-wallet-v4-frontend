import { selectors } from 'data'

export const getData = state => ({
  userState: selectors.modules.profile.getUserActivationState(state),
  kycState: selectors.modules.profile.getUserKYCState(state)
})
