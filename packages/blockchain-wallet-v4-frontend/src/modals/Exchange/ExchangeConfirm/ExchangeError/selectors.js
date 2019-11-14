import { lift, path } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const min = selectors.components.exchange.getMin(state)
  const max = selectors.components.exchange.getMax(state)
  const limitsR = selectors.components.exchange.getLimits(state)
  const currencyR = selectors.core.settings.getCurrency(state)

  const transform = (limits, currency) => {
    const symbol = path([currency, 'daily', 'symbol'], limits)
    const dailyLimit = path([currency, 'daily', 'amount', 'limit'], limits)
    const annualLimit = path([currency, 'annual', 'amount', 'limit'], limits)

    return {
      min,
      max,
      symbol,
      dailyLimit,
      annualLimit
    }
  }

  return lift(transform)(limitsR, currencyR)
}
