import { complement, equals, path } from 'ramda'

import { model, selectors } from 'data'

const { TIERS_STATES } = model.profile

export const getData = state => ({
  hasEmail: selectors.core.settings
    .getEmail(state)
    .map(Boolean)
    .getOrElse(false),
  userCreated: selectors.modules.profile
    .getTiers(state)
    .map(path([0, 'state']))
    .map(complement(equals(TIERS_STATES.NONE)))
})
