import { lift } from 'ramda'

import { selectors } from 'data'

export const getQuoteInputData = (state) => {
  const level = selectors.core.data.coinify.getLevel(state)
  const kyc = selectors.core.data.coinify.getKyc(state)
  const canTrade = selectors.core.data.coinify.canTrade(state)
  const cannotTradeReason = selectors.core.data.coinify.cannotTradeReason(state)
  const profile = selectors.core.data.coinify.getProfile(state)
  return lift((level, kyc, canTrade, cannotTradeReason, profile) => ({ level, kyc, canTrade, cannotTradeReason, profile }))(level, kyc, canTrade, cannotTradeReason, profile)
}
