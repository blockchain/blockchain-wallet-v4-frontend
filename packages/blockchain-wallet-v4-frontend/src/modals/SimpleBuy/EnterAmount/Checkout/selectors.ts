import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { SBCheckoutFormValuesType } from 'data/types'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const formErrors = selectors.form.getFormSyncErrors('simpleBuyCheckout')(
    state
  )
  const formValues = selectors.form.getFormValues('simpleBuyCheckout')(
    state
  ) as SBCheckoutFormValuesType
  const invitationsR = selectors.core.settings.getInvitations(state)
  const suggestedAmountsR = selectors.components.simpleBuy.getSBSuggestedAmounts(
    state
  )
  const userDataR = selectors.modules.profile.getUserData(state)

  return lift(
    (
      invitations: ExtractSuccess<typeof invitationsR>,
      suggestedAmounts: ExtractSuccess<typeof suggestedAmountsR>,
      userData: ExtractSuccess<typeof userDataR>
    ) => ({
      formErrors,
      formValues,
      invitations,
      suggestedAmounts,
      userData
    })
  )(invitationsR, suggestedAmountsR, userDataR)
}
