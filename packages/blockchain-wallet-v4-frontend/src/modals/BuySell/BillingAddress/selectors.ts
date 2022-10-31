import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { model, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { BSBillingAddressFormValuesType } from 'data/types'

const { FORMS_BS_BILLING_ADDRESS } = model.components.buySell

export const getData = (state: RootState) => {
  const formValues = selectors.form.getFormValues(FORMS_BS_BILLING_ADDRESS)(
    state
  ) as BSBillingAddressFormValuesType
  const userDataR = selectors.modules.profile.getUserData(state)
  const useLoqateServiceEnabledR = selectors.core.walletOptions.useLoqateServiceEnabled(state)

  return lift(
    (
      userData: ExtractSuccess<typeof userDataR>,
      useLoqateServiceEnabled: ExtractSuccess<typeof useLoqateServiceEnabledR>
    ) => ({
      formValues,
      useLoqateServiceEnabled,
      userData
    })
  )(userDataR, useLoqateServiceEnabledR)
}
