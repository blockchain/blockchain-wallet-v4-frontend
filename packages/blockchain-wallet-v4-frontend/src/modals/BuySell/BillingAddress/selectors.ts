import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { BSBillingAddressFormValuesType } from 'data/types'

export const getData = (state: RootState) => {
  const formValues = selectors.form.getFormValues('ccBillingAddress')(
    state
  ) as BSBillingAddressFormValuesType
  const userDataR = selectors.modules.profile.getUserData(state)

  return lift((userData: ExtractSuccess<typeof userDataR>) => ({
    formValues,
    userData
  }))(userDataR)
}
