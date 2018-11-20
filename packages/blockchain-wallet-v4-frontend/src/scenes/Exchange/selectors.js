import { selectors } from 'data'
import { KYC_STATES } from 'data/modules/profile/model'

export const getData = state => ({
  verified: selectors.modules.profile.getUserKYCState(state).getOrElse(null) === KYC_STATES.VERIFIED
})
