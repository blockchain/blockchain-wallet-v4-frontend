import { path } from 'ramda'
import { dataPath } from '../../paths'

export const getSfox = path([dataPath, 'sfox'])

export const getQuote = path([dataPath, 'sfox', 'quote'])

export const getSellQuote = path([dataPath, 'sfox', 'sellQuote'])

export const getTrades = path([dataPath, 'sfox', 'trades'])

export const getProfile = path([dataPath, 'sfox', 'profile'])

export const getAccounts = path([dataPath, 'sfox', 'achAccounts'])

export const getVerificationStatus = state =>
  getProfile(state).map(path(['verificationStatus']))

export const getBankAccounts = path([dataPath, 'sfox', 'bankAccounts'])
