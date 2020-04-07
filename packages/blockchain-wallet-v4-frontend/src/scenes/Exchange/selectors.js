import { complement, equals, lift, path } from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { model, selectors } from 'data'
import { Remote } from 'blockchain-wallet-v4/src'

const { TIERS_STATES } = model.profile

export const getData = createDeepEqualSelector(
  [
    selectors.modules.profile.getUserData,
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
  (userDataR, hasEmail, userCreatedR) => {
    const isLoading = Remote.Loading.is(userDataR)
    return lift((userData, userCreated) => ({
      userData,
      hasEmail,
      isLoading,
      userCreated
    }))(userDataR, userCreatedR)
  }
)
