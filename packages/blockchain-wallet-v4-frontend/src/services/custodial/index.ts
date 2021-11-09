import { LimitWithEffective, SeamlessLimits } from 'data/types'

export const getEffectiveLimit = (limits: SeamlessLimits): LimitWithEffective | undefined => {
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
