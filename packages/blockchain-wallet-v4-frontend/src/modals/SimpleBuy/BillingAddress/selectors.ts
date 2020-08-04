import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { SBBillingAddressFormValuesType } from 'data/types'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const formValues = selectors.form.getFormValues('ccBillingAddress')(
    state
  ) as SBBillingAddressFormValuesType
  const userDataR = selectors.modules.profile.getUserData(state)

  return lift((userData: ExtractSuccess<typeof userDataR>) => ({
    formValues,
    userData
  }))(userDataR)
}
