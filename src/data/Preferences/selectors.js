import { path } from 'ramda'

export const getCulture = path(['preferences', 'culture'])

export const getLanguage = path(['preferences', 'language'])

export const getEmail = path(['preferences', 'email'])

export const isChangingEmail = path(['preferences', 'changingEmail'])
