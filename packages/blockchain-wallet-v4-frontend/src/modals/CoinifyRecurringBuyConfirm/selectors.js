import { selectors } from 'data'
import { filter, prop, length } from 'ramda'

const isCardTrade = t =>
  prop('medium', t) === 'card' && prop('state', t) === 'completed'

export const getNumberOfTradesAway = state => {
  const trades = selectors.core.data.coinify.getTrades(state).getOrElse([])
  const ccTrades = filter(isCardTrade, trades)
  return 3 - length(ccTrades)
}

export const getCanMakeRecurringTrade = state => {
  const countryCode = selectors.core.settings.getCountryCode(state).getOrElse('GB')
  const trades = selectors.core.data.coinify.getTrades(state).getOrElse([])
  const level = selectors.core.data.coinify.getLevel(state).getOrElse()

  const ccTrades = filter(isCardTrade, trades)
  const needsTrades = length(ccTrades) < 3

  const needsKyc = level.name < 2
  console.log('recurring modal selectors', needsKyc, needsTrades, trades, level, countryCode)

  if (needsTrades && needsKyc) return 'needs_kyc_trades'
  if (needsKyc) return 'needs_kyc'
  if (needsTrades) return 'needs_trades'

  // check country
  if (countryCode === 'GB') return false

  return true
}
