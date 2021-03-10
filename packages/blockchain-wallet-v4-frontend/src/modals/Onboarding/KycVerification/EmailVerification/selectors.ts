import { lift } from 'ramda'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { model, selectors } from 'data'
import { RootState } from 'data/rootReducer'

const { VERIFY_EMAIL_FORM } = model.components.identityVerification

export const getData = (state: RootState) => {
  const formErrors = selectors.form.getFormSyncErrors(VERIFY_EMAIL_FORM)(state)

  const isUserSddEligibleR = selectors.components.simpleBuy.isUserSddEligible(
    state
  )

  const email = selectors.core.settings.getEmail(state).getOrElse('')

  return lift(
    (isUserSddEligible: ExtractSuccess<typeof isUserSddEligibleR>) => ({
      isUserSddEligible,
      formErrors,
      email
    })
  )(isUserSddEligibleR)
}
