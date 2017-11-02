import { concat, map, path } from 'ramda'
// import { KVStoreEntry } from '../../../types'
import { ETHEREUM } from '../config'

export const getAccounts = path([ETHEREUM, 'value', 'ethereum', 'accounts'])

export const getLegacyAccount = path([ETHEREUM, 'value', 'ethereum', 'legacy_account'])

export const getContext = state => {
  const accounts = getAccounts(state)
  const legacyAccount = getLegacyAccount(state)
  return map(account => account.addr, concat([legacyAccount], accounts))
}
