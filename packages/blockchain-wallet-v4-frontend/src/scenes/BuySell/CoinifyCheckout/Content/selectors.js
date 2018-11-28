import { lift, equals, or } from 'ramda'

import { selectors, model } from 'data'

const { NONE, PENDING, UNDER_REVIEW, VERIFIED } = model.profile.KYC_STATES

export const getQuoteInputData = state => {
  const kycState = selectors.modules.profile.getUserKYCState(state)
  const level = selectors.core.data.coinify.getLevel(state)
  const canTrade = selectors.core.data.coinify.canTrade(state)
  const cannotTradeReason = selectors.core.data.coinify.cannotTradeReason(state)
  const canTradeAfter = selectors.core.data.coinify.canTradeAfter(state)

  const kycNotFinished = kycState.map(equals(NONE)).getOrElse(false)
  const kycPending = kycState.map(kyc => or(equals(kyc, PENDING), equals(kyc, UNDER_REVIEW))).getOrElse(false)
  const kycVerified = kycState.map(equals(VERIFIED)).getOrElse(false)

  return lift((level, canTrade, cannotTradeReason, canTradeAfter) => ({
    level,
    canTrade,
    cannotTradeReason,
    canTradeAfter,
    kycNotFinished,
    kycVerified,
    kycPending
  }))(level, canTrade, cannotTradeReason, canTradeAfter)
}
