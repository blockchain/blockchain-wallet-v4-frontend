import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { BSAddCardFormValuesType } from 'data/types'

export const getData = (state: RootState) => {
  const formValues = selectors.form.getFormValues('addCCForm')(state) as BSAddCardFormValuesType
  const order = selectors.components.buySell.getBSOrder(state)
  const paymentMethodsR = selectors.components.buySell.getBSPaymentMethods(state)
  const supportedCountriesR = selectors.components.identityVerification.getSupportedCountries(state)
  const userDataR = selectors.modules.profile.getUserData(state)

  return lift(
    (
      paymentMethods: ExtractSuccess<typeof paymentMethodsR>,
      supportedCountries: ExtractSuccess<typeof supportedCountriesR>,
      userData: ExtractSuccess<typeof userDataR>
    ) => ({
      formValues,
      order,
      paymentMethods,
      supportedCountries,
      userData
    })
  )(paymentMethodsR, supportedCountriesR, userDataR)
}
