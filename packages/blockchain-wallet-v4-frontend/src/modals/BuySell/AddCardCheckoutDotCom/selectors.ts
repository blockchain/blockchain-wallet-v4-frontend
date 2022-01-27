import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const order = selectors.components.buySell.getBSOrder(state)
  const paymentMethodsR = selectors.components.buySell.getBSPaymentMethods(state)
  const supportedCountriesR = selectors.components.identityVerification.getSupportedCountries(state)
  const userDataR = selectors.modules.profile.getUserData(state)
  const eligibilityR = selectors.components.buySell.getBSFiatEligible(state)

  return lift(
    (
      paymentMethods: ExtractSuccess<typeof paymentMethodsR>,
      supportedCountries: ExtractSuccess<typeof supportedCountriesR>,
      userData: ExtractSuccess<typeof userDataR>,
      eligibility: ExtractSuccess<typeof eligibilityR>
    ) => ({
      eligibility,
      order,
      paymentMethods,
      supportedCountries,
      userData
    })
  )(paymentMethodsR, supportedCountriesR, userDataR, eligibilityR)
}
