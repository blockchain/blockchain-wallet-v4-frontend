import { selectors } from 'data'
import { lift, filter, prop, length } from 'ramda'

export const getData = state => {
  const trades = selectors.core.data.coinify.getTrades(state).getOrElse([])
  const level = selectors.core.data.coinify.getLevel(state).getOrElse()
  // console.log('getData', trades, level)
  return lift(trades, level => ({ trades, level }))(trades, level)
}

export const getCanMakeRecurringTrade = state => {
  const countryCode = selectors.core.settings.getCountryCode(state).getOrElse('GB')
  const trades = selectors.core.data.coinify.getTrades(state).getOrElse([])
  const level = selectors.core.data.coinify.getLevel(state).getOrElse()
  console.log('recurring modal selectors', trades, level, countryCode)
  // TODO: check for country === GB, 3 or more trades with CC, completed KYC

  // check country
  if (countryCode === 'GB') return false

  // check cc trades
  const isCardTrade = t => prop('medium', t) === 'card'
  const ccTrades = filter(isCardTrade, trades)
  if (length(ccTrades) < 3) return false

  // check KYC level
  return true
}
