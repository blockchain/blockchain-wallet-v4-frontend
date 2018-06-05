import { isNil, prop } from 'ramda'

export const hasAccount = (partners) => {
  const { coinify, sfox } = partners
  if (!isNil(prop('account_token', sfox))) return 'sfox'
  if (!isNil(prop('offline_token', coinify))) return 'coinify'
}

export const findMatch = (settings, options) => {
  /* eslint-disable */
  const { country_code, state } = settings
  /* eslint-enable */
  const { sfox, coinify } = options.platforms.web

  // if user's location matches a partner country code set match
  if (coinify.countries.indexOf(country_code) > -1) return 'coinify'
  if (sfox.countries.indexOf(country_code) > -1 && (sfox.states.indexOf(state) > -1 || !state)) return 'sfox'
}

// settings, options, buySell, type ('Buy' || 'Sell') => 'partner' || false
export const canTrade = (settings, options, buySell, type) => {
  // if user has an account return 'partner'
  const account = hasAccount(buySell.value)
  if (account) return account

  // if location does not match any partner return false
  const match = findMatch(settings, options)
  if (!match) return false

  // check if user is invited to location match => 'partner'
  const { invited } = settings
  switch (match) {
    case 'sfox': return (type ? invited['sfox' + type] : (invited.sfoxBuy || invited.sfoxSell)) && 'sfox'
    case 'coinify': return (type ? invited['coinify' + type] : (invited.coinifyBuy || invited.coinifySell)) && 'coinify'
    default: return false
  }
}
