import { lift, equals } from 'ramda'
import { selectors, model } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

const { VERIFIED, NONE } = model.profile.KYC_STATES

export const getData = createDeepEqualSelector(
  [
    selectors.core.data.coinify.getProfile,
    selectors.core.data.coinify.getLimits,
    selectors.core.data.coinify.getLevel,
    selectors.core.data.coinify.getMediums,
    selectors.modules.profile.getUserKYCState
  ],
  (profileR, limitsR, levelR, mediumsR, kycStateR) => {
    const transform = (profile, limits, level, mediums, kycState) => {
      const kycVerified = equals(kycState, VERIFIED)
      const kycNone = equals(kycState, NONE)
      return {
        profile,
        limits,
        level,
        mediums,
        kycVerified,
        kycNone
      }
    }
    return lift(transform)(profileR, limitsR, levelR, mediumsR, kycStateR)
  }
)

export const getQuote = createDeepEqualSelector(
  [selectors.core.data.coinify.getQuote],
  quoteR => {
    const transform = quote => quote
    return lift(transform)(quoteR)
  }
)
