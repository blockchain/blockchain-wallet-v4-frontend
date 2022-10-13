import { Remote } from '@core'
import { EarnEDDStatus, SDDEligibleType } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { UserDataType, UserTierType } from 'data/types'

const getData = (state: RootState) => {
  const userData = selectors.modules.profile.getUserData(state).getOrElse({
    address: undefined,
    id: '',
    kycState: 'NONE',
    mobile: '',
    mobileVerified: false,
    state: 'NONE',
    tiers: { current: 0 }
  } as UserDataType)
  // @ts-ignore
  const userTiers = selectors.modules.profile.getTiers(state).getOrElse({} as UserTierType)

  const sddEligible = selectors.components.buySell.getSddEligible(state).getOrElse({
    eligible: false,
    ineligibilityReason: 'KYC_TIER',
    tier: 0
  } as SDDEligibleType)

  const earnEDDStatus = selectors.components.interest
    .getEarnEDDStatus(state)
    .getOrElse({} as EarnEDDStatus)

  return Remote.Success({
    earnEDDStatus,
    sddEligible,
    userData,
    userTiers
  })
}

export default getData
