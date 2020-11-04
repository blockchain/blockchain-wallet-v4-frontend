import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { SBAddCardFormValuesType } from 'data/types'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const formValues = selectors.form.getFormValues('addCCForm')(
    state
  ) as SBAddCardFormValuesType
  const order = selectors.components.simpleBuy.getSBOrder(state)
  const paymentMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(
    state
  )
  const supportedCountriesR = selectors.components.identityVerification.getSupportedCountries(
    state
  )

  return lift(
    (
      paymentMethods: ExtractSuccess<typeof paymentMethodsR>,
      supportedCountries: ExtractSuccess<typeof supportedCountriesR>
    ) => ({
      formValues,
      order,
      paymentMethods,
      supportedCountries
    })
  )(paymentMethodsR, supportedCountriesR)
}
