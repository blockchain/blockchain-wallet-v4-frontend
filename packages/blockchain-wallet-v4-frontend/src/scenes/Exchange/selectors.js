import { equals } from 'ramda'

import { selectors } from 'data'
import { KYC_STATES } from 'data/modules/profile/model'

export const getData = state => ({
  hasEmail: selectors.core.settings
    .getEmail(state)
    .map(Boolean)
    .getOrElse(false),
  verified: selectors.modules.profile
    .getUserKYCState(state)
    .map(equals(KYC_STATES.VERIFIED))
})
