import { assoc, assocPath, compose, concat, lift, map, path, prop, sequence } from 'ramda'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

export const getData = (state, coin) => {
  const toDropdown = map(x => ({ text: x.label, value: x }))
  const formatAddressesData = (addressesData) => addressesData.map(a => a.data.map(d => { d.text = `${d.text} (${Exchange.displayCoinToCoin({ value: d.value.balance, coin: d.value.coin, baseToStandard: true })})` }))

  const importedAddresses = selectors.core.common.bch.getActiveAddresses(state)

  // const formatAddress = (addressData) => {
  //   const formattedAddress = {}
  //   return compose(
  //     a => assoc('text', `${prop('addr', addressData)} (${Exchange.displayCoinToCoin({ value: path(['info', 'final_balance'], addressData), coin: coin, baseToStandard: true })})`, a),
  //     a => assocPath(['value', 'balance'], path(['info', 'final_balance'], addressData), a),
  //     a => assocPath(['value', 'coin'], coin, a),
  //     // a => assocPath(['value', 'index'], path(['info', 'final_balance'], addressData), a),
  //     // a => assocPath(['value', 'xpub'], path(['info', 'final_balance'], addressData), a),
  //     a => assocPath(['value', 'label'], prop('addr', addressData), a)
  //   )(formattedAddress)
  // }

  const formatAddress = (addressData) => {
    const formattedAddress = {}
    return compose(
      a => assoc('text', prop('addr', addressData), a),
      a => assocPath(['value', 'balance'], path(['info', 'final_balance'], addressData), a),
      a => assocPath(['value', 'coin'], coin, a),
      a => assoc('value', prop('info', addressData), a)
    )(formattedAddress)
  }

  const formatImportedAddressesData = (addressesData) => {
    return map(formatAddress, addressesData)
  }

  const getAddressesData = (coin) => {
    switch (coin) {
      case 'BCH': return sequence(Remote.of,
        [
          selectors.core.common.bch.getAccountsBalances(state).map(toDropdown),
          lift(formatImportedAddressesData)(importedAddresses)
        ]).map(([b1, b2]) => ({ data: concat(b1, b2) }))
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
