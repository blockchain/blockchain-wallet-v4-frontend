import { lift } from 'ramda'
import { RootState } from 'data/rootReducer'
import { selectors } from 'data'

export const getData = (state: RootState) => {
  const accountR = selectors.components.simpleBuy.getSBAccount(state)
  const userDataR = selectors.modules.profile.getUserData(state)

  // TODO: Remove this when ach deposits withdrawals gets rolled out hundo P
  const invitationsR = selectors.core.settings.getInvitations(state)
  const isInvited = invitationsR.data.achDepositWithdrawal

  return lift((account, userData) => ({ account, userData, isInvited }))(
    accountR,
    userDataR
  )
}
