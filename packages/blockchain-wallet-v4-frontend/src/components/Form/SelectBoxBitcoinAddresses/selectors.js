import { assoc, assocPath, compose, concat, filter, lift, map, path, prop, sequence } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

export const getData = (state, ownProps) => {
  const { coin, exclude = [], excludeImported } = ownProps
  const isActive = filter(x => !x.archived)
  const excluded = filter(x => !exclude.includes(x.label))
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
            selectors.core.common.bch.getAccountsBalances(state).map(isActive).map(excluded).map(toDropdown),
            excludeImported ? Remote.of([]) : lift(formatImportedAddressesData)(importedAddresses)
          ]).map(([b1, b2]) => ({ data: concat(b1, b2) }))
      default:
        return sequence(Remote.of,
          [
            selectors.core.common.btc.getActiveAccountsBalances(state).map(excluded).map(toDropdown),
            excludeImported ? Remote.of([]) : selectors.core.common.btc.getAddressesBalances(state).map(toDropdown)
          ]).map(([b1, b2]) => ({ data: concat(b1, b2) }))
    }
  }

  return getAddressesData()
}
