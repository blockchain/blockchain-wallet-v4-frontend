import { lift } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const userStateR = selectors.modules.profile.getUserActivationState(state)
  const kycStateR = selectors.modules.profile.getUserKYCState(state)

  return {
    data: lift((userState, kycState) => ({ userState, kycState }))(
      userStateR,
      kycStateR
    )
  }
}
