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
    includeAll = true,
    includePitAddress
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
  const toPit = x => [{ label: `BTC PIT Address (${x})`, value: x }]
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
        : selectors.core.common.btc
            .getLockboxBtcBalances(state)
            .map(excluded)
            .map(toDropdown)
            .map(toGroup('Lockbox')),
      includePitAddress
        ? selectors.components.send
            .getPaymentsAccountPit('BTC', state)
            .map(toPit)
            .map(toGroup('The PIT'))
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
