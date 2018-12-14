import { compose, isNil, map, max, prop, propEq, reduce } from 'ramda'

import { selectors, model } from 'data'
import { currencySymbolMap } from 'services/CoinifyService'

const { TIERS_STATES } = model.profile

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

const checkPreviousTiersRejection = (state, selected) => {
  let tier = selected - 1
  while (tier >= 1) {
    const tierRejected = selectors.modules.profile
      .getTier(tier, state)
      .map(propEq('state', TIERS_STATES.REJECTED))
      .getOrElse(true)

    if (!tierRejected) return false
    tier--
  }

  return true
}

export const getData = state => {
  const { next, selected } = selectors.modules.profile
    .getUserTiers(state)
    .getOrElse({})
  const userLimits = selectors.modules.profile
    .getUserLimits(state)
    .getOrElse({})
  const lastAttemptedTier = selectors.modules.profile
    .getLastAttemptedTier(state)
    .getOrElse(null) || { index: 0, state: TIERS_STATES.NONE }
  const lastAttemptedTierState = prop('state', lastAttemptedTier)
  const limit = compose(
    reduce(max, 0),
    map(getMinLimit)
  )(userLimits)
  const nextTierAvailable = next > lastAttemptedTier.index
  const lastTierRejected = lastAttemptedTierState === TIERS_STATES.REJECTED
  const allPreviousTiersRejected = checkPreviousTiersRejection(state, selected)

  return {
    tier: lastAttemptedTier.index,
    nextTier: next,
    hideTier:
      lastAttemptedTier.index === 0 || (lastTierRejected && !nextTierAvailable),
    limit,
    lastTierState: lastAttemptedTierState,
    showPending:
      allPreviousTiersRejected &&
      lastAttemptedTierState === TIERS_STATES.PENDING,
    showLimit:
      lastAttemptedTierState === TIERS_STATES.ACTIVE &&
      limit !== Infinity &&
      userLimits[0].currency,
    currencySymbol: currencySymbolMap[userLimits[0].currency],
    nextTierAvailable,
    nextTierInReview:
      !allPreviousTiersRejected &&
      lastAttemptedTierState === TIERS_STATES.PENDING,
    upgradeRequired: lastTierRejected && nextTierAvailable
  }
}
