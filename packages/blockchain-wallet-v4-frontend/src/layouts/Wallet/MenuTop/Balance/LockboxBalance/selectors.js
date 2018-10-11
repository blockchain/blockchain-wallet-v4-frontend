import { prop } from 'ramda'
import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = state =>
  createDeepEqualSelector(
    [
      selectors.preferences.getTotalBalancesDropdown,
      selectors.core.settings.getInvitations
    ],
    (totalBalancesDropdown, invitationsR) => ({
      totalBalancesDropdown,
      lockboxEnabled: prop('lockbox', invitationsR.getOrElse({}))
    })
  )(state)
