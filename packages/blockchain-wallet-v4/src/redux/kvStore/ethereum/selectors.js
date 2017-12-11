import { prepend, compose, head, map, path, prop, isNil } from 'ramda'
import { ETHEREUM } from '../config'
import { kvStorePath } from '../../paths'

export const getAccounts = path([kvStorePath, ETHEREUM, 'value', 'ethereum', 'accounts'])

export const getDefaultAccount = compose(head, getAccounts)

export const getLegacyAccount = path([kvStorePath, ETHEREUM, 'value', 'ethereum', 'legacy_account'])

export const getLegacyAccountAddress = compose(prop('addr'), getLegacyAccount)

export const getDefaultAccountAddress = compose(prop('addr'), head, getAccounts)

export const getContext = state => {
  const legacyAccount = getLegacyAccount(state)
  const accounts = getAccounts(state)
  const allAccounts = !isNil(legacyAccount) ? prepend(legacyAccount, accounts) : accounts
  return map(prop('addr'), allAccounts)
}
