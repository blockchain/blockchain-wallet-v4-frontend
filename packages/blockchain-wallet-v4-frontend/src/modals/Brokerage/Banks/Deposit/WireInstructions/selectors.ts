import { lift } from 'ramda'

import { InvitationsType } from 'core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getData = (state: RootState) => {
  const accountR = selectors.components.simpleBuy.getSBAccount(state)
  const userDataR = selectors.modules.profile.getUserData(state)

  // TODO: Remove this when ach deposits withdrawals gets rolled out hundo P
  const invitationsR: InvitationsType = selectors.core.settings
    .getInvitations(state)
    .getOrElse({
      achDepositWithdrawal: false,
      openBanking: false
    } as InvitationsType)

  return lift((account, userData, isInvited) => ({
    account,
    userData,
    isInvited
  }))(accountR, userDataR, invitationsR)
}
