import { lift } from 'ramda'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { SBBillingAddressFormValuesType } from 'data/types'

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
