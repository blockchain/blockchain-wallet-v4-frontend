import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.core.settings.getInvitations,
    selectors.components.priceChart.getTime,
    selectors.modules.profile.isSilverOrAbove
  ],
  (invitationsR, time, isSilverOrAbove) => ({
    time,
    isSilverOrAbove,
    invitations: invitationsR.getOrElse({ simpleBuy: false })
  })
)
