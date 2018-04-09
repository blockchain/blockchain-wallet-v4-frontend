import { concat } from 'ramda'

export const partnerCountryWhitelist = () => {
  const sfox = []
  const unocoin = []
  const coinify = []
  return concat(concat(sfox, unocoin), coinify)
}

export const sfoxWhitelist = []
export const sfoxCountries = []
export const unocoinCountries = []
export const coinifyCountries = []
