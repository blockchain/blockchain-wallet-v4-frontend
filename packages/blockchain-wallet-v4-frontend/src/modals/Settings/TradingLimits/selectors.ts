import { lift } from 'ramda'

import { EarnEDDStatus, ExtractSuccess, FiatType } from '@core/types'
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

  const earnEDDStatus = selectors.components.interest
    .getEarnEDDStatus(state)
    .getOrElse({} as EarnEDDStatus)

  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  return lift(
    (limitsAndDetails: ExtractSuccess<typeof limitsAndDetailsR>, walletCurrency: FiatType) => ({
      earnEDDStatus,
      limitsAndDetails,
      userData,
      userTiers,
      walletCurrency
    })
  )(limitsAndDetailsR, walletCurrencyR)
}

export default getData
