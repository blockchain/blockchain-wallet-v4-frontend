import { ADDRESS_TYPES } from 'core/redux/payment/btc/utils'
import {
  assoc,
  assocPath,
  compose,
  concat,
  curry,
  descend,
  filter,
  has,
  head,
  isNil,
  lensIndex,
  lensProp,
  lift,
  map,
  not,
  path,
  prepend,
  prop,
  reduce,
  // @ts-ignore
  sequence,
  set,
  sort
} from 'ramda'
import { collapse } from 'utils/helpers'
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

export const getData = (
  state,
  ownProps: {
    coin: 'BCH'
    exclude?: Array<string>
    excludeHDWallets?: boolean
    excludeImported?: boolean
    excludeLockbox?: boolean
    excludeWatchOnly?: boolean
    includeAll?: boolean
    includeCustodial?: boolean
    includeExchangeAddress?: boolean
  }
) => {
  const {
    coin,
    exclude = [],
    excludeHDWallets,
    excludeImported,
    excludeLockbox,
    excludeWatchOnly,
    includeAll = true,
    includeExchangeAddress,
    includeCustodial
  } = ownProps
  const buildDisplay = wallet => {
    const label = collapse(wallet.label)
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

  const buildCustodialDisplay = x => {
    return (
      `BCH Trading Wallet` +
      ` (${Exchange.displayBchToBch({
        value: x ? x.available : 0,
        fromUnit: 'SAT',
        toUnit: 'BCH'
      })})`
    )
  }

  // @ts-ignore
  const isActive = filter(x => !x.archived)
  // @ts-ignore
  const excluded = filter(x => !exclude.includes(x.label))
  const toDropdown = map(x => ({
    label: buildDisplay(x),
    value: x
  }))
  const toGroup = curry((label, options) => [{ label, options }])
  const toExchange = x => [
    {
      label: `Exchange BCH Address`,
      value: x
    }
  ]
  const toCustodialDropdown = x => [
    {
      label: buildCustodialDisplay(x),
      value: {
        ...x,
        type: ADDRESS_TYPES.CUSTODIAL,
        label: 'BCH Trading Wallet'
      }
    }
  ]

  const exchangeAddress = selectors.components.send.getPaymentsAccountExchange(
    'BCH',
    state
  )
  const hasExchangeAddress = Remote.Success.is(exchangeAddress)

  const formatAddress = addressData => {
    const formattedAddress = {}
    return compose(
      a =>
        isNil(prop('label', addressData))
          ? assoc('label', prop('addr', addressData), a)
          : assoc('label', prop('label', addressData), a),
      a => assocPath(['value', 'type'], ADDRESS_TYPES.LEGACY, a),
      a =>
        assocPath(
          ['value', 'balance'],
          path(['info', 'final_balance'], addressData),
          a
        ),
      a => assocPath(['value', 'coin'], coin, a),
      a => assocPath(['value', 'address'], prop('addr', addressData), a),
      a => assoc('value', prop('info', addressData), a)
    )(formattedAddress)
  }

  const formatImportedAddressesData = addressesData => {
    return map(formatAddress, addressesData)
  }

  const getAddressesData = () => {
    const importedAddresses = selectors.core.common.bch.getActiveAddresses(
      state
    )
    const filterRelevantAddresses = addrs =>
      excludeWatchOnly
        ? filter(addr => {
            // @ts-ignore
            return not(isNil(prop('priv', addr)))
          }, addrs)
        : addrs
    const relevantAddresses = lift(filterRelevantAddresses)(importedAddresses)

    return sequence(Remote.of, [
      includeExchangeAddress && hasExchangeAddress
        ? exchangeAddress.map(toExchange).map(toGroup('Exchange'))
        : Remote.of([]),
      selectors.core.common.bch
        .getAccountsBalances(state)
        .map(isActive)
        .map(excluded)
        .map(toDropdown)
        .map(toGroup('Wallet')),
      includeCustodial
        ? selectors.components.simpleBuy
            .getSBBalances(state)
            .map<any, any>(prop('BCH'))
            .map(toCustodialDropdown)
            .map(toGroup('Custodial Wallet'))
        : Remote.of([]),
      excludeImported
        ? Remote.of([])
        : lift(formatImportedAddressesData)(relevantAddresses)
            .map(toGroup('Imported Addresses'))
            .map(x =>
              set(
                // @ts-ignore
                compose(
                  lensIndex(0),
                  lensProp('options')
                ),
                sort(
                  descend(path(['value', 'balance'])),
                  // @ts-ignore
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
            .map(toGroup('Lockbox'))
    ]).map(([b1, b2, b3, b4, b5]) => {
      // @ts-ignore
      const data = reduce(concat, [], [b1, b2, b3, b4, b5])
      if (includeAll) {
        return {
          data: prepend(allWallets, data)
        }
      } else if (excludeHDWallets) {
        return {
          data: [allImportedAddresses]
        }
      } else {
        return { data }
      }
    })
  }

  return getAddressesData()
}
