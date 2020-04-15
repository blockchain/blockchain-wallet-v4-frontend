import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import { collapse } from 'utils/helpers'
import {
  compose,
  concat,
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
  // @ts-ignore
  sequence,
  set,
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

export const getData = (
  state,
  ownProps: {
    exclude?: Array<string>
    excludeHDWallets?: boolean
    excludeImported?: boolean
    excludeLockbox?: boolean
    includeAll?: boolean
    includeCustodial?: boolean
    includeExchangeAddress?: boolean
  }
) => {
  const {
    exclude = [],
    excludeHDWallets,
    excludeImported,
    excludeLockbox,
    includeAll = true,
    includeCustodial,
    includeExchangeAddress
  } = ownProps
  const buildDisplay = wallet => {
    const label = collapse(wallet.label)
    if (has('balance', wallet)) {
      let btcDisplay = Exchange.displayBtcToBtc({
        value: wallet.balance,
        fromUnit: 'SAT',
        toUnit: 'BTC'
      })
      return label + ` (${btcDisplay})`
    }
    return label
  }
  const buildCustodialDisplay = x => {
    return (
      `BTC Trading Wallet` +
      ` (${Exchange.displayBtcToBtc({
        value: x ? x.available : 0,
        fromUnit: 'SAT',
        toUnit: 'BTC'
      })})`
    )
  }
  // @ts-ignore
  const excluded = filter(x => !exclude.includes(x.label))
  const toDropdown = map(x => ({ label: buildDisplay(x), value: x }))
  const toGroup = curry((label, options) => [{ label, options }])
  const toExchange = x => [{ label: `Exchange BTC Address`, value: x }]
  const toCustodialDropdown = x => [
    {
      label: buildCustodialDisplay(x),
      value: {
        ...x,
        type: ADDRESS_TYPES.CUSTODIAL,
        label: 'BTC Trading Wallet'
      }
    }
  ]

  const exchangeAddress = selectors.components.send.getPaymentsAccountExchange(
    'BTC',
    state
  )
  const hasExchangeAddress = Remote.Success.is(exchangeAddress)

  const getAddressesData = () => {
    return sequence(Remote.of, [
      includeExchangeAddress && hasExchangeAddress
        ? exchangeAddress.map(toExchange).map(toGroup('Exchange'))
        : Remote.of([]),
      selectors.core.common.btc
        .getActiveAccountsBalances(state)
        .map(excluded)
        .map(toDropdown)
        .map(toGroup('Wallet')),
      includeCustodial
        ? selectors.components.simpleBuy
            .getSBBalances(state)
            .map<any, any>(prop('BTC'))
            .map(toCustodialDropdown)
            .map(toGroup('Custodial Wallet'))
        : Remote.of([]),
      excludeImported
        ? Remote.of([])
        : selectors.core.common.btc
            .getAddressesBalances(state)
            .map(toDropdown)
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
        : selectors.core.common.btc
            .getLockboxBtcBalances(state)
            .map(excluded)
            .map(toDropdown)
            .map(toGroup('Lockbox'))
    ]).map(([b1, b2, b3, b4, b5]) => {
      // @ts-ignore
      const data = reduce(concat, [], [b1, b2, b3, b4, b5])
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
