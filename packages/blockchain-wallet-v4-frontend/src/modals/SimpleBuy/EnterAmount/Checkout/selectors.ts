import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const formErrors = selectors.form.getFormSyncErrors('simpleBuyCheckout')(
    state
  )
  const formValues = selectors.form.getFormValues('simpleBuyCheckout')(state)
  const suggestedAmountsR = selectors.components.simpleBuy.getSBSuggestedAmounts(
    state
  )
  const userDataR = selectors.modules.profile.getUserData(state)

  return lift((suggestedAmounts, userData) => ({
    formErrors,
    formValues,
    suggestedAmounts,
    userData
  }))(suggestedAmountsR, userDataR)
}
