import { map } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const toDropdown = map(x => ({ label: x.label + ' (Bitcoin Cash)', value: x }))
  return selectors.core.common.bitcoin.getAccountsBalances(state).map(toDropdown)
}
