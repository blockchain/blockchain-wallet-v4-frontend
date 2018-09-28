import { selectors } from 'data'

export const getData = state => ({
  kycState: selectors.modules.profile.getUserKYCState(state),
  userFlowSupported: selectors.modules.profile
    .userFlowSupported(state)
    .getOrElse(false)
})
