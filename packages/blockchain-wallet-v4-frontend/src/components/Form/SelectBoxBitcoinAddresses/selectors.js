import { assoc, assocPath, compose, concat, lift, map, path, prop, sequence } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

export const getData = (state, ownProps) => {
  const { coin, excludeImported } = ownProps
  const toDropdown = map(x => ({ text: x.label, value: x }))

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

  const getAddressesData = () => {
    switch (coin) {
      case 'BCH':
        const importedAddresses = selectors.core.common.bch.getActiveAddresses(state)
        return sequence(Remote.of,
          [
            selectors.core.common.bch.getAccountsBalances(state).map(toDropdown),
            excludeImported ? Remote.of([]) : lift(formatImportedAddressesData)(importedAddresses)
          ]).map(([b1, b2]) => ({ data: concat(b1, b2) }))
      default:
        return sequence(Remote.of,
          [
            selectors.core.common.bitcoin.getActiveAccountsBalances(state).map(toDropdown),
            excludeImported ? Remote.of([]) : selectors.core.common.bitcoin.getAddressesBalances(state).map(toDropdown)
          ]).map(([b1, b2]) => ({ data: concat(b1, b2) }))
    }
  }

  return getAddressesData()
}
