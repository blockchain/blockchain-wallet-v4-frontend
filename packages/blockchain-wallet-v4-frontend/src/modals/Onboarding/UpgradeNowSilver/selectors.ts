import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { UserDataType, UserTierType } from 'data/types'

const getData = (state: RootState) => {
  // @ts-ignore
  const userTiers = selectors.modules.profile.getTiers(state).getOrElse({} as UserTierType)

  const userData = selectors.modules.profile.getUserData(state).getOrElse({
    address: undefined,
    id: '',
    kycState: 'NONE',
    mobile: '',
    mobileVerified: false,
    state: 'NONE',
    tiers: { current: 0 }
  } as UserDataType)

  const productsR = selectors.custodial.getProductEligibilityForUser(state)

  return lift((products: ExtractSuccess<typeof productsR>) => ({
    products,
    userData,
    userTiers
  }))(productsR)
}

export default getData
