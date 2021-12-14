import { CrossBorderLimits, CrossBorderLimitSuggestedItem, LimitWithEffective } from '@core/types'

export const getEffectiveLimit = (limits: CrossBorderLimits): LimitWithEffective | undefined => {
  const { current } = limits
  switch (true) {
    case current?.daily?.effective:
      return current.daily
    case current?.monthly?.effective:
      return current.monthly
    case current?.yearly?.effective:
      return current.yearly
    default:
      return undefined
  }
}

export const getEffectivePeriod = (limits: CrossBorderLimits): string | undefined => {
  const { current } = limits
  switch (true) {
    case current?.daily?.effective:
      return 'day'
    case current?.monthly?.effective:
      return 'month'
    case current?.yearly?.effective:
      return 'year'
    default:
      return undefined
  }
}

export const getSuggestedPeriod = (limits: CrossBorderLimits): string | undefined => {
  const { suggestedUpgrade } = limits
  if (suggestedUpgrade?.daily) {
    return 'day'
  }
  if (suggestedUpgrade?.monthly) {
    return 'month'
  }
  if (suggestedUpgrade?.yearly) {
    return 'year'
  }
  return undefined
}

export const getSuggestedLimit = (
  limits: CrossBorderLimits
): CrossBorderLimitSuggestedItem | undefined => {
  const { suggestedUpgrade } = limits
  if (suggestedUpgrade?.daily) {
    return suggestedUpgrade?.daily
  }
  if (suggestedUpgrade?.monthly) {
    return suggestedUpgrade?.monthly
  }
  if (suggestedUpgrade?.yearly) {
    return suggestedUpgrade?.yearly
  }
  return undefined
}
