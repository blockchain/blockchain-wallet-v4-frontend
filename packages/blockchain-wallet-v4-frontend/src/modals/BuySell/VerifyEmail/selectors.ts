import { Remote } from '@core'
import { model, selectors } from 'data'
import { RootState } from 'data/rootReducer'

const { BS_CHANGE_EMAIL_FORM } = model.components.buySell

export const getData = (state: RootState) => {
  const formErrors = selectors.form.getFormSyncErrors(BS_CHANGE_EMAIL_FORM)(state)

  const emailAuth = selectors.auth.getRegisterEmail(state)
  const emailFromSettings = selectors.core.settings.getEmail(state).getOrElse(null)
  const isUserSddEligibleR = selectors.components.buySell.isUserSddEligible(state)

  // compare if user changed email from auth
  const email = emailFromSettings && emailAuth !== emailFromSettings ? emailFromSettings : emailAuth

  const isUserSddEligible = isUserSddEligibleR.getOrElse(false)

  return Remote.Success({
    email,
    formErrors,
    isUserSddEligible
  })
}
