import { concat } from 'ramda'
import { Network } from 'blockchain-wallet-v4/src'

const options = Network.Options().getWalletOptions()

export const partnerCountryWhitelist = () => {
  const sfox = options.platforms.web.sfox.countries
  const unocoin = options.platforms.web.unocoin.countries
  const coinify = options.platforms.web.coinify.countries
  return concat(concat(sfox, unocoin), coinify)
}

export const sfoxWhitelist = options.platforms.web.sfox.states
export const sfoxCountries = options.platforms.web.sfox.countries
export const unocoinCountries = options.platforms.web.unocoin.countries
export const coinifyCountries = options.platforms.web.coinify.countries
