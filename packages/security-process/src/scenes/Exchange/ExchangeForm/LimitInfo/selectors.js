import { compose, isNil, map, max, path, prop, reduce, take } from 'ramda'

import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors, model } from 'data'
import { currencySymbolMap } from 'services/CoinifyService'

const {
  TIERS_STATES,
  getLastAttemptedTier,
  getLastUnrejectedTier,
  getLastVerifiedTier
} = model.profile

const getLimit = compose(
  limit => (isNil(limit) ? Infinity : limit),
  prop
)
const getMinLimit = limits => {
  const dailyLimit = getLimit('daily', limits)
  const weeklyLimit = getLimit('weekly', limits)
  const monthlyLimit = getLimit('monthly', limits)
  const annualLimit = getLimit('annual', limits)

  let minLimit = dailyLimit
  if (weeklyLimit < minLimit) minLimit = weeklyLimit
  if (monthlyLimit < minLimit) minLimit = monthlyLimit
  if (annualLimit < minLimit) minLimit = annualLimit

  return minLimit
}

export const getData = createDeepEqualSelector(
  [
    state => selectors.modules.profile.getUserTiers(state).getOrElse({}),
    state => selectors.modules.profile.getUserLimits(state).getOrElse([]),
    state => selectors.modules.profile.getTiers(state).getOrElse([])
  ],
  (userTiers, userLimits, tiers) => {
    const { next, selected } = userTiers

    const currency = path([0, 'currency'], userLimits)

    const lastAttemptedTier = getLastAttemptedTier(tiers) || {
      index: 0,
      state: TIERS_STATES.NONE
    }
    const lastAttemptedTierState = prop('state', lastAttemptedTier)
    const last = lastAttemptedTier.index

    const lastUnrejectedTier = getLastUnrejectedTier(take(last, tiers))
    const allAttemptedTiersRejected = !lastUnrejectedTier

    const lastVerifiedTier = getLastVerifiedTier(tiers)

    const limit = compose(
      reduce(max, 0),
      map(getMinLimit)
    )(userLimits)

    const nextTierAvailable = next > last

    const allPreviousTiersRejected = !getLastUnrejectedTier(
      take(selected - 1, tiers)
    )

    return {
      tier: (lastVerifiedTier || lastAttemptedTier).index,
      nextTier: next,
      hideTier: last === 0 || (allAttemptedTiersRejected && !nextTierAvailable),
      limit,
      lastTierState: lastAttemptedTierState,
      showPending:
        allPreviousTiersRejected &&
        lastAttemptedTierState === TIERS_STATES.PENDING,
      showLimit:
        Boolean(lastVerifiedTier) && limit !== Infinity && Boolean(currency),
      currencySymbol: currencySymbolMap[currency],
      nextTierAvailable,
      lastTierInReview:
        !allPreviousTiersRejected &&
        lastAttemptedTierState === TIERS_STATES.PENDING,
      upgradeRequired: allAttemptedTiersRejected && nextTierAvailable
    }
  }
)
