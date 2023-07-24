import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { FORMS_BS_BILLING_ADDRESS } from 'data/components/buySell/model'
import { RootState } from 'data/rootReducer'
import { BSBillingAddressFormValuesType } from 'data/types'

export const getData = (state: RootState) => {
  const paymentMethodsR = selectors.components.buySell.getBSPaymentMethods(state)
  const supportedCountriesR = selectors.components.identityVerification.getSupportedCountries(state)
  const userDataR = selectors.modules.profile.getUserData(state)
  const eligibilityR = selectors.components.buySell.getBSFiatEligible(state)
  const formValues = selectors.form.getFormValues(FORMS_BS_BILLING_ADDRESS)(
    state
  ) as BSBillingAddressFormValuesType

  return lift(
    (
      paymentMethods: ExtractSuccess<typeof paymentMethodsR>,
      supportedCountries: ExtractSuccess<typeof supportedCountriesR>,
      userData: ExtractSuccess<typeof userDataR>,
      eligibility: ExtractSuccess<typeof eligibilityR>
    ) => ({
      eligibility,
      formValues,
      paymentMethods,
      supportedCountries,
      userData
    })
  )(paymentMethodsR, supportedCountriesR, userDataR, eligibilityR)
}
