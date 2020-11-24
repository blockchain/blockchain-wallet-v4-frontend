import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { model, selectors } from 'data'
import { RootState } from 'data/rootReducer'

const { INFO_AND_RESIDENTIAL_FORM } = model.components.identityVerification

export const getData = (state: RootState) => {
  const formErrors = selectors.form.getFormSyncErrors(
    INFO_AND_RESIDENTIAL_FORM
  )(state)

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
