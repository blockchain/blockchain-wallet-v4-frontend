import { complement, equals, lift, path } from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { model, selectors } from 'data'

const { TIERS_STATES } = model.profile

export const getData = createDeepEqualSelector(
  [
    state =>
      selectors.core.settings
        .getEmail(state)
        .map(Boolean)
        .getOrElse(false),
    state =>
      selectors.modules.profile
        .getTiers(state)
        .map(path([0, 'state']))
        .map(complement(equals(TIERS_STATES.NONE)))
  ],
  (hasEmail, userCreatedR) => {
    return lift(userCreated => ({
      hasEmail,
      userCreated
    }))(userCreatedR)
  }
)
