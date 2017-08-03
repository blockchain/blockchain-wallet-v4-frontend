import { path } from 'ramda'

export const getCulture = path(['preferences', 'culture'])

export const getLanguage = path(['preferences', 'language'])

export const getTheme = path(['theme', 'theme'])

export const getEmail = path(['preferences', 'email'])

export const isChangingEmail = path(['preferences', 'changingEmail'])

export const getCoinDisplayed = path(['preferences', 'coinDisplayed'])
