import { lift } from 'ramda'
import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [
    selectors.core.data.coinify.getProfile,
    selectors.core.data.coinify.getLimits,
    selectors.core.data.coinify.getLevel,
    selectors.core.data.coinify.getMediums,
    selectors.core.data.coinify.getSortedKycs
  ],
  (profileR, limitsR, levelR, mediumsR, kycsR) => {
    const transform = (profile, limits, level, mediums, kycs) => {
      return {
        profile,
        limits,
        level,
        mediums,
        kycs
      }
    }
    return lift(transform)(profileR, limitsR, levelR, mediumsR, kycsR)
  }
)

export const getQuote = createDeepEqualSelector(
  [selectors.core.data.coinify.getQuote],
  (quoteR) => {
    const transform = quote => quote
    return lift(transform)(quoteR)
  }
)
