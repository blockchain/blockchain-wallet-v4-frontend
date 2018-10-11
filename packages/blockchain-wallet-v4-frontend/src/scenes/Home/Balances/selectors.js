import { prop } from 'ramda'
import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = state =>
  createDeepEqualSelector(
    [
      selectors.components.layoutWallet.getBalancesTable,
      selectors.core.settings.getInvitations
    ],
    (currentTab, invitationsR) => ({
      currentTab,
      showLockbox: prop('lockbox', invitationsR.getOrElse({}))
    })
  )(state)
