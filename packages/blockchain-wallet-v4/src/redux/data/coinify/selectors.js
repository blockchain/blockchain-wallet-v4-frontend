import { path } from 'ramda'
import { dataPath } from '../../paths'

export const getSfox = path([dataPath, 'coinify'])

export const getQuote = path([dataPath, 'coinify', 'quote'])

export const getTrades = path([dataPath, 'coinify', 'trades'])

export const getProfile = path([dataPath, 'coinify', 'profile'])

export const getAccounts = path([dataPath, 'coinify', 'accounts'])

export const getVerificationStatus = state => getProfile(state).map(path(['verificationStatus']))

export const getBankAccounts = path([dataPath, 'coinify', 'bankAccounts'])
