import { curry, path } from 'ramda'

export const getCulture = path(['preferences', 'culture'])
export const getLanguage = path(['preferences', 'language'])
export const getTheme = path(['preferences', 'theme'])
export const getCoinDisplayed = path(['preferences', 'coinDisplayed'])
export const getShowKycCompleted = path(['preferences', 'showKycCompleted'])
export const getPriceChart = path(['preferences', 'priceChart'])
export const getTotalBalancesDropdown = path([
  'preferences',
  'totalBalancesDropdown'
])
export const getCoinShowIntro = curry((state, coin) =>
  path(['preferences', 'coinIntros', coin])(state)
)
