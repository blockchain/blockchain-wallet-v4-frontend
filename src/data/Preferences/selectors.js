import { path } from 'ramda'

export const getCulture = path(['preferences', 'culture'])

export const getLanguage = path(['preferences', 'language'])
