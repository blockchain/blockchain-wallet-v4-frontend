import { lift } from 'ramda'

import { selectors } from 'data'

export const getQuoteInputData = state => {
  const level = selectors.core.data.coinify.getLevel(state)
  const canTrade = selectors.core.data.coinify.canTrade(state)
  const cannotTradeReason = selectors.core.data.coinify.cannotTradeReason(state)
  const canTradeAfter = selectors.core.data.coinify.canTradeAfter(state)

  return lift((level, canTrade, cannotTradeReason, canTradeAfter) => ({
    level,
    canTrade,
    cannotTradeReason,
    canTradeAfter
  }))(level, canTrade, cannotTradeReason, canTradeAfter)
}
