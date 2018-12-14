import { compose, isNil, map, max, prop, reduce } from 'ramda'

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

export const getData = state => {
  const { current, next } = selectors.modules.profile
    .getUserTiers(state)
    .getOrElse({})
  const userLimits = selectors.modules.profile
    .getUserLimits(state)
    .getOrElse({})
  const nextTier = selectors.modules.profile
    .getTier(next, state)
    .getOrElse(null)
  const currentTier = selectors.modules.profile
    .getTier(current, state)
    .getOrElse(null)
  const limit = compose(
    reduce(max, 0),
    map(getMinLimit)
  )(userLimits)

  return {
    currentTier: current,
    nextTier: next,
    showTier:
      current > 0 && prop('state', currentTier) !== TIERS_STATES.REJECTED,
    limit,
    showLimit: limit !== Infinity && userLimits[0].currency,
    currencySymbol: currencySymbolMap[userLimits[0].currency],
    nextTierAvailable: next > current,
    nextTierInReview: prop('state', nextTier) === TIERS_STATES.PENDING
  }
}
