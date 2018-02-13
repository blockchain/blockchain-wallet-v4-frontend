import { sequence, concat, map, head } from 'ramda'
import { selectors } from 'data'
import { Remote } from 'blockchain-wallet-v4/src'

export const getData = state => {
  const toDropdown = map(x => ({ text: x.label, value: x || x.xpub }))
  const toElements = (bitcoin, ethereum) => [{ group: 'Bitcoin',  items: bitcoin }, { group: 'Ethereum', items: ethereum }]

  return sequence(Remote.of, [
    selectors.core.common.ethereum.getAccountBalances(state).map(toDropdown),
    selectors.core.common.bitcoin.getAccountsBalances(state).map(toDropdown),
    selectors.core.common.bitcoin.getAddressesBalances(state).map(toDropdown)
  ]).map(([e, b1, b2]) => ({ elements: toElements(concat(b1, b2), e), sourceDefault: head(e), targetDefault: head(b1) }))
}
