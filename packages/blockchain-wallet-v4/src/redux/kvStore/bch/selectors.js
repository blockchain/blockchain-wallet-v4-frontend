import { keys, lift, map, path } from 'ramda'
import { BCH } from '../config'
import { kvStorePath } from '../../paths'

export const getMetadata = path([kvStorePath, BCH])

// Attention: returns an object with index as keys, not an array
export const getAccounts = state => getMetadata(state).map(path(['value', 'accounts']))

// This one returns an array of accounts
export const getAccountsList = state => {
  const accountsObj = getAccounts(state)
  return lift(a => map(key => a[key], keys(a)))(accountsObj)
}

export const getDefaultAccountId = state => getMetadata(state).map(path(['value', 'default_account_idx']))
