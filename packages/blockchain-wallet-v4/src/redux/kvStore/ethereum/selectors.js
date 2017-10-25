import { concat, map, path, prop, compose } from 'ramda'
import { KVStoreEntry } from '../../../types'
import { ETHEREUM } from '../config'

export const getAccounts = compose(path(['ethereum', 'accounts']), KVStoreEntry.selectValue, prop(ETHEREUM))

export const getLegacyAccount = compose(path(['ethereum', 'legacy_account']), KVStoreEntry.selectValue, prop(ETHEREUM))

export const getContext = state => {
  const accounts = getAccounts(state)
  const legacyAccount = getLegacyAccount(state)
  return map(account => account.addr, concat([legacyAccount], accounts))
}
