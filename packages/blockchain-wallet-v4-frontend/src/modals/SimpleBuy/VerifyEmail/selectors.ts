import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { lift } from 'ramda'

import { model, selectors } from 'data'
import { RootState } from 'data/rootReducer'

const { SB_CHANGE_EMAIL_FORM } = model.components.simpleBuy

export const getData = (state: RootState) => {
  const formErrors = selectors.form.getFormSyncErrors(SB_CHANGE_EMAIL_FORM)(
    state
  )

  const emailAuth = selectors.auth.getRegisterEmail(state)
  const emailFromSettings = selectors.core.settings
    .getEmail(state)
    .getOrElse(null)
  const isUserSddEligibleR = selectors.components.simpleBuy.isUserSddEligible(
    state
  )

  // compare if user changed email from auth
  const email =
    emailFromSettings && emailAuth !== emailFromSettings
      ? emailFromSettings
      : emailAuth

  return lift(
    (isUserSddEligible: ExtractSuccess<typeof isUserSddEligibleR>) => ({
      isUserSddEligible,
      formErrors,
      email
    })
  )(isUserSddEligibleR)
}
