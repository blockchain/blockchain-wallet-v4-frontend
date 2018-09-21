import { selectors } from 'data'

export const getData = state => ({
  kycState: selectors.modules.profile.getUserKYCState(state),
  canTrade: selectors.exchange.getCanTrade(state).getOrElse(false),
  userFlowSupported: selectors.modules.profile
    .userFlowSupported(state)
    .getOrElse(false)
})
