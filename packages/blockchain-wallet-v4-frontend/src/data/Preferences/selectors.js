import { path } from 'ramda'

export const getCulture = path(['culture'])

export const getLanguage = path(['language'])

export const getTheme = path(['theme'])

export const getEmail = path(['email'])

export const isChangingEmail = path(['changingEmail'])

export const getCoinDisplayed = path(['coinDisplayed'])
