import { lift } from 'ramda'

import { ExtractSuccess, FiatType } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const userDataR = selectors.modules.profile.getUserData(state)
  const walletCurrencyR = selectors.core.settings.getCurrency(state)
  const fix = selectors.components.swap.getFix(state)
  const custodialEligibilityR = selectors.components.swap.getCustodialEligibility(state)
  const productsR = selectors.custodial.getProductEligibilityForUser(state)

  return lift(
    (
      userData: ExtractSuccess<typeof userDataR>,
      walletCurrency: FiatType,
      custodialEligibility: ExtractSuccess<typeof custodialEligibilityR>,
      products: ExtractSuccess<typeof productsR>
    ) => ({
      custodialEligibility,
      fix,
      products,
      userData,
      walletCurrency
    })
  )(userDataR, walletCurrencyR, custodialEligibilityR, productsR)
}

export default getData
