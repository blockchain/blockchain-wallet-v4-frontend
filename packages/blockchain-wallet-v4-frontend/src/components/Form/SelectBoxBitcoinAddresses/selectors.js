import { concat, map, sequence } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

export const getData = state => {
  const toDropdown = map(x => ({ text: x.label, value: x }))
  return sequence(Remote.of, [
    selectors.core.common.bitcoin.getAccountsBalances(state).map(toDropdown),
    selectors.core.common.bitcoin.getAddressesBalances(state).map(toDropdown)
  ]).map(([b1, b2]) => ({ bitcoin: concat(b1, b2) }))
}
