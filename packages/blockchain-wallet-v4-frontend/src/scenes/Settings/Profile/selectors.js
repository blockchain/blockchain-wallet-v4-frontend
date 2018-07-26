import { selectors } from 'data'

export const getData = state => ({
  kycState: selectors.modules.profile.getUserKYCState(state)
})
