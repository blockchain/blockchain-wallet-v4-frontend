import { map } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const accounts = map(x => ({ label: x.label, value: x }))
  return selectors.core.common.bitcoin.getAccountsBalances(state).map(accounts)
}
