import {
  concat,
  curry,
  descend,
  filter,
  has,
  map,
  sequence,
  sort,
  reduce,
  prepend,
  prop,
  head,
  path,
  set,
  lensProp,
  compose,
  lensIndex
} from 'ramda'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

const allWallets = {
  label: 'All',
  options: [
    {
      label: 'All Bitcoin Wallets',
      value: 'all'
    }
  ]
}

const allImportedAddresses = {
  label: 'Imported Addresses',
  options: [
    {
      label: 'All Imported Bitcoin Addresses',
      value: 'allImportedAddresses'
    }
  ]
}

export const getData = (state, ownProps) => {
  const {
    exclude = [],
    excludeHDWallets,
    excludeImported,
    excludeLockbox,
    includeAll = true
  } = ownProps
  const buildDisplay = wallet => {
    if (has('balance', wallet)) {
      let btcDisplay = Exchange.displayBtcToBtc({
        value: wallet.balance,
        fromUnit: 'SAT',
        toUnit: 'BTC'
      })
      return wallet.label + ` (${btcDisplay})`
    }
    return wallet.label
  }
  const excluded = filter(x => !exclude.includes(x.label))
  const toDropdown = map(x => ({ label: buildDisplay(x), value: x }))
  const toGroup = curry((label, options) => [{ label, options }])

  const getAddressesData = () => {
    return sequence(Remote.of, [
      selectors.core.common.btc
        .getActiveAccountsBalances(state)
        .map(excluded)
        .map(toDropdown)
        .map(toGroup('Wallet')),
      excludeImported
        ? Remote.of([])
        : selectors.core.common.btc
            .getAddressesBalances(state)
            .map(toDropdown)
            .map(toGroup('Imported Addresses')),
      excludeLockbox
        ? Remote.of([])
        : selectors.core.common.btc
            .getLockboxBtcBalances(state)
            .map(excluded)
            .map(toDropdown)
            .map(toGroup('Lockbox'))
    ]).map(([b1, b2, b3]) => {
      const importedAddressesSorted = set(
        compose(
          lensIndex(0),
          lensProp('options')
        ),
        sort(descend(path(['value', 'balance'])), prop('options', head(b2))),
        b2
      )
      const data = reduce(concat, [], [b1, importedAddressesSorted, b3])
      if (includeAll) {
        return { data: prepend(allWallets, data) }
      } else if (excludeHDWallets) {
        return { data: [allImportedAddresses] }
      } else {
        return { data }
      }
    })
  }
  return getAddressesData()
}
