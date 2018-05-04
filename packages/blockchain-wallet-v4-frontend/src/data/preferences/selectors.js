import { path } from 'ramda'

export const getCulture = path(['preferences', 'culture'])

export const getLanguage = path(['preferences', 'language'])

export const getTheme = path(['preferences', 'theme'])

export const getCoinDisplayed = path(['preferences', 'coinDisplayed'])

export const getShowEtherWelcome = path(['preferences', 'showEtherWelcome'])

export const getShowBitcoinWelcome = path(['preferences', 'showBitcoinWelcome'])

export const getShowBitcoinCashWelcome = path(['preferences', 'showBitcoinCashWelcome'])
