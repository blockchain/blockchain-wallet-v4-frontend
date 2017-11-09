import { concat, map, path, isNil } from 'ramda'
// import { KVStoreEntry } from '../../../types'
import { ETHEREUM } from '../config'

export const getAccounts = path([ETHEREUM, 'value', 'ethereum', 'accounts'])

export const getLegacyAccount = path([ETHEREUM, 'value', 'ethereum', 'legacy_account'])

export const getContext = state => {
  const legacyAccount = getLegacyAccount(state)
  const accounts = getAccounts(state)
  const allAccounts = !isNil(legacyAccount) ? concat([legacyAccount], accounts) : getAccounts()
  return map(account => account.addr, allAccounts)
}
