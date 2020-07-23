import { ExtractSuccess } from 'core/types'
import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const formErrors = selectors.form.getFormSyncErrors('simpleBuyCheckout')(
    state
  )
  const invitationsR = selectors.core.settings.getInvitations(state)
  const suggestedAmountsR = selectors.components.simpleBuy.getSBSuggestedAmounts(
    state
  )
  const sbBalancesR = selectors.components.simpleBuy.getSBBalances(state)
  const userDataR = selectors.modules.profile.getUserData(state)

  return lift(
    (
      invitations: ExtractSuccess<typeof invitationsR>,
      sbBalances: ExtractSuccess<typeof sbBalancesR>,
      suggestedAmounts: ExtractSuccess<typeof suggestedAmountsR>,
      userData: ExtractSuccess<typeof userDataR>
    ) => ({
      formErrors,
      invitations,
      sbBalances,
      suggestedAmounts,
      userData
    })
  )(invitationsR, sbBalancesR, suggestedAmountsR, userDataR)
}
