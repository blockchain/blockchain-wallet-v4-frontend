import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const formValues = selectors.form.getFormValues('ccBillingAddress')(state)
  const userDataR = selectors.modules.profile.getUserData(state)

  return lift(userData => ({ formValues, userData }))(userDataR)
}
