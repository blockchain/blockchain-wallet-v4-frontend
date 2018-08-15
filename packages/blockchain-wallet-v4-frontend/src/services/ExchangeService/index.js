import { isNil, path } from 'ramda'

export const hasAccount = partners => {
  if (!isNil(path(['sfox', 'account_token'], partners))) return 'sfox'
  if (!isNil(path(['coinify', 'offline_token'], partners))) return 'coinify'
}

export const findMatch = (settings, options) => {
  /* eslint-disable */
  const { country_code, state } = settings
  /* eslint-enable */
  const { sfox, coinify } = options.platforms.web

  // if user's location matches a partner country code set match
  if (coinify.countries.indexOf(country_code) > -1) return 'coinify'
  if (
    sfox.countries.indexOf(country_code) > -1 &&
    (sfox.states.indexOf(state) > -1 || !state)
  ) {
    return 'sfox'
  }
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

  // v2 -> v3 upgrades do not have invited object
  if (!invited) return false

  switch (match) {
    case 'sfox':
      return (
        (type
          ? type === 'Buy'
            ? // check sfoxBuyV4 to avoid conflict with v3
              // which also checks invited.sfoxBuy
              invited['sfoxBuyV4']
            : invited['sfoxSell']
          : invited.sfoxBuyV4 || invited.sfoxSell) && 'sfox'
      )
    case 'coinify':
      return (
        (type
          ? invited['coinify' + type]
          : invited.coinifyBuy || invited.coinifySell) && 'coinify'
      )
    default:
      return false
  }
}
