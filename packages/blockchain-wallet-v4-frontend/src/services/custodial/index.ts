import { CrossBorderLimits, LimitWithEffective } from '@core/types'

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
