import {
  concat,
  compose,
  curry,
  descend,
  filter,
  has,
  head,
  lensIndex,
  lensProp,
  map,
  path,
  prepend,
  prop,
  reduce,
  set,
  sequence,
  sort
} from 'ramda'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

const allWallets = {
  label: 'All',
  options: [
    {
      label: 'All Bitcoin Cash Wallets',
      value: 'all'
    }
  ]
}

const allImportedAddresses = {
  label: 'Imported Addresses',
  options: [
    {
      label: 'All Imported Bitcoin Cash Addresses',
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
    includeAll = true,
    includePitAddress
  } = ownProps
  const buildDisplay = wallet => {
    const label =
      wallet.label.length > 30
        ? wallet.label.replace(/(.{15})..+/, '$1…')
        : wallet.label
    if (has('balance', wallet)) {
      let bchDisplay = Exchange.displayBchToBch({
        value: wallet.balance,
        fromUnit: 'SAT',
        toUnit: 'BCH'
      })
      return label + ` (${bchDisplay})`
    }
    return label
  }
  const isActive = filter(x => !x.archived)
  const excluded = filter(x => !exclude.includes(x.label))
  const toDropdown = map(x => ({ label: buildDisplay(x), value: x }))
  const toGroup = curry((label, options) => [{ label, options }])
  const toPit = x => [{ label: `My PIT BCH Address`, value: x }]

  const pitAddress = selectors.components.send.getPaymentsAccountPit(
    'BCH',
    state
  )
  const hasPitAddress = Remote.Success.is(pitAddress)

  const getAddressesData = () => {
    return sequence(Remote.of, [
      selectors.core.common.bch
        .getAccountsBalances(state)
        .map(isActive)
        .map(excluded)
        .map(toDropdown)
        .map(toGroup('Wallet')),
      excludeImported
        ? Remote.of([])
        : selectors.core.common.bch
            .getAddressesBalances(state)
            .map(toDropdown)
            .map(toGroup('Imported Addresses'))
            .map(x =>
              set(
                compose(
                  lensIndex(0),
                  lensProp('options')
                ),
                sort(
                  descend(path(['value', 'balance'])),
                  prop('options', head(x))
                ),
                x
              )
            ),
      excludeLockbox
        ? Remote.of([])
        : selectors.core.common.bch
            .getLockboxBchBalances(state)
            .map(excluded)
            .map(toDropdown)
            .map(toGroup('Lockbox')),
      includePitAddress && hasPitAddress
        ? pitAddress.map(toPit).map(toGroup('The PIT'))
        : Remote.of([])
    ]).map(([b1, b2, b3, b4]) => {
      const data = reduce(concat, [], [b1, b2, b3, b4])
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
