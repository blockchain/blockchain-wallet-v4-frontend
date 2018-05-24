import { lift } from 'ramda'
// import settings from 'config'
import { selectors } from 'data'

export const getQuoteInputData = (state) => {
  const level = selectors.core.data.coinify.getLevel(state)
  const kycs = selectors.core.data.coinify.getKycs(state)
  const canTrade = selectors.core.data.coinify.canTrade(state)
  const cannotTradeReason = selectors.core.data.coinify.cannotTradeReason(state)
  const profile = selectors.core.data.coinify.getProfile(state)
  return lift((level, kycs, canTrade, cannotTradeReason, profile) => ({ level, kycs, canTrade, cannotTradeReason, profile }))(level, kycs, canTrade, cannotTradeReason, profile)
}
