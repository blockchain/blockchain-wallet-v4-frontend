import { lift } from 'ramda'

import { EarnEDDStatus, ExtractSuccess, FiatType, SDDEligibleType } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { UserDataType, UserTierType } from 'data/types'

const getData = (state: RootState) => {
  const limitsAndDetailsR = selectors.components.settings.getLimitsAndDetails(state)

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

  const productsR = selectors.custodial.getProductEligibilityForUser(state)
  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  return lift(
    (
      limitsAndDetails: ExtractSuccess<typeof limitsAndDetailsR>,
      products: ExtractSuccess<typeof productsR>,
      walletCurrency: FiatType
    ) => ({
      earnEDDStatus,
      limitsAndDetails,
      products,
      sddEligible,
      userData,
      userTiers,
      walletCurrency
    })
  )(limitsAndDetailsR, productsR, walletCurrencyR)
}

export default getData
