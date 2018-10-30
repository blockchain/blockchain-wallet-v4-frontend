import { selectors } from 'data'

export const getData = state => {
  return {
    userState: selectors.modules.profile.getUserActivationState(state),
    kycState: selectors.modules.profile.getUserKYCState(state)
  }
}
