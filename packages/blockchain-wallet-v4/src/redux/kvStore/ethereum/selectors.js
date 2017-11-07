import { map, path } from 'ramda'
// import { KVStoreEntry } from '../../../types'
import { ETHEREUM } from '../config'

export const getAccounts = path([ETHEREUM, 'value', 'ethereum', 'accounts'])

export const getLegacyAccount = path([ETHEREUM, 'value', 'ethereum', 'legacy_account'])

export const getContext = state => map(account => account.addr, getAccounts(state))
