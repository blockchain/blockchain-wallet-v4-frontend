
import { path } from 'ramda'

export const getCoins = path(['payment', 'coins'])
export const getSelection = path(['payment', 'selection'])
export const getEffectiveBalance = path(['payment', 'effectiveBalance'])
