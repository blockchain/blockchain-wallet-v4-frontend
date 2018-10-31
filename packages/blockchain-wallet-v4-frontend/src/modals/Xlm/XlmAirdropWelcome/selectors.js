import { lift } from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.modules.profile.getUserActivationState,
    selectors.modules.profile.getUserKYCState
  ],
  (userStateR, kycStateR) => {
    return {
      data: lift((userState, kycState) => ({ userState, kycState }))(
        userStateR,
        kycStateR
      )
    }
  }
)
