import { take } from 'ramda'

import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors, model } from 'data'

const {
  TIERS_STATES,
  getLastAttemptedTier,
  getLastUnrejectedTier
} = model.profile

export const getData = createDeepEqualSelector(
  [
    state => selectors.modules.profile.getUserTiers(state).getOrElse({}),
    state => selectors.modules.profile.getTiers(state).getOrElse([])
  ],
  (userTiers, tiers) => {
    const { next } = userTiers
    const lastAttemptedTier = getLastAttemptedTier(tiers) || {
      index: 0,
      state: TIERS_STATES.NONE
    }
    const last = lastAttemptedTier.index
    const allAttemptedTiersRejected = !getLastUnrejectedTier(take(last, tiers))
    const nextTierAvailable = next > last
    return {
      showNotification: allAttemptedTiersRejected && !nextTierAvailable
    }
  }
)
