import { concat, map, sequence } from 'ramda'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

export const getData = (state, coin) => {
  const toDropdown = map(x => ({ text: x.label, value: x }))
  const formatAddressesData = (addressesData) => addressesData.map(a => a.data.map(d => { d.text = `${d.text} (${Exchange.displayCoinToCoin({ value: d.value.balance, coin: d.value.coin, baseToStandard: true })})` }))

  const getAddressesData = (coin) => {
    switch (coin) {
      case 'BCH': return sequence(Remote.of, [selectors.core.common.bch.getAccountsBalances(state).map(toDropdown)]).map(([b]) => ({ data: b }))
      default: return sequence(Remote.of,
        [
          selectors.core.common.bitcoin.getAccountsBalances(state).map(toDropdown),
          selectors.core.common.bitcoin.getAddressesBalances(state).map(toDropdown)
        ]).map(([b1, b2]) => ({ data: concat(b1, b2) }))
    }
  }

  const addressesData = getAddressesData(coin)
  formatAddressesData(addressesData)

  return addressesData
}
