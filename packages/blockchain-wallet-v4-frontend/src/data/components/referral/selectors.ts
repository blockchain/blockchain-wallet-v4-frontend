import { RootState } from 'data/rootReducer'

export const getReferralInformation = (state: RootState) =>
  state.components.referral.referralInformation
