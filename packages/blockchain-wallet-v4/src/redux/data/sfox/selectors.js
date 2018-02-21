import { path } from 'ramda'
import { dataPath } from '../../paths'

export const getQuote = path([dataPath, 'sfox', 'quote'])

export const getProfile = path([dataPath, 'sfox', 'profile'])

export const getAccounts = path([dataPath, 'sfox', 'accounts'])

export const getVerificationStatus = state => getProfile(state).map(path(['verificationStatus']))
