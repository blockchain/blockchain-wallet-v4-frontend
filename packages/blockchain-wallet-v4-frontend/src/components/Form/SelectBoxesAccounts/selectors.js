import { sequence, concat, map, head } from 'ramda'
import { selectors } from 'data'
import { Remote } from 'blockchain-wallet-v4/src'

export const getData = state => {
  const toDropdown = map(x => ({ text: x.label, value: x.address || x.xpub }))
  return sequence(Remote.of, [
    selectors.core.common.ethereum.getAccountBalances(state).map(toDropdown),
    selectors.core.common.bitcoin.getAccountsBalances(state).map(toDropdown),
    selectors.core.common.bitcoin.getAddressesBalances(state).map(toDropdown),
    selectors.core.common.bch.getAccountsBalances(state).map(toDropdown),
    selectors.core.common.bch.getAddressesBalances(state).map(toDropdown)
  ]).map(([e, b1, b2, bch1, bch2]) => ({ ethereum: e, ethereumDefault: head(e), bitcoin: concat(b1, b2), bitcoinDefault: head(b1), bch: concat(bch1, bch2), bchDefault: head(bch1) }))
}
