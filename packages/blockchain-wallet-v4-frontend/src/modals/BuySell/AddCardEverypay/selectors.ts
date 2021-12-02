import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { model, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { BSAddCardFormValuesType } from 'data/types'

const { FORM_BS_ADD_EVERYPAY_CARD } = model.components.buySell

export const getData = (state: RootState) => {
  const formValues = selectors.form.getFormValues(FORM_BS_ADD_EVERYPAY_CARD)(
    state
  ) as BSAddCardFormValuesType
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
