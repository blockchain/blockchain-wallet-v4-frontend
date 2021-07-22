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

import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import { InterestAccountBalanceType } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { collapse } from 'utils/helpers'

const allWallets = {
  label: 'All',
  options: [
    {
      label: 'All BCH Private Key Wallets',
      value: 'all'
    }
  ]
}

const allImportedAddresses = {
  label: 'Imported Addresses',
  options: [
    {
      label: 'All Imported BCH Addresses',
      value: 'allImportedAddresses'
    }
  ]
}

export const getData = (
  state,
  ownProps: {
    coin?: 'BCH'
    exclude?: Array<string>
    excludeHDWallets?: boolean
    excludeImported?: boolean
    excludeLockbox?: boolean
    forceCustodialFirst?: boolean
    includeAll?: boolean
    includeCustodial?: boolean
    includeExchangeAddress?: boolean
    includeInterest?: boolean
  }
) => {
  const {
    coin,
    exclude = [],
    excludeHDWallets,
    excludeImported,
    excludeLockbox,
    includeAll = true,
    includeExchangeAddress,
    includeCustodial,
    includeInterest,
    forceCustodialFirst
  } = ownProps

  const buildDisplay = (wallet) => {
    const label = collapse(wallet.label)
    if (has('balance', wallet)) {
      const bchDisplay = Exchange.displayCoinToCoin({
        coin: 'BCH',
        value: wallet.balance
      })
      return `${label} (${bchDisplay})`
    }
    return label
  }

  const buildCustodialDisplay = (x) => {
    return (
      `Trading Account` +
      ` (${Exchange.displayCoinToCoin({
        coin: 'BCH',
        value: x ? x.available : 0
      })})`
    )
  }

  const buildInterestDisplay = (x: InterestAccountBalanceType['BCH']) => {
    return (
      `Interest Account` +
      ` (${Exchange.displayCoinToCoin({
        coin: 'BCH',
        value: x ? x.balance : 0
      })})`
    )
  }

  // @ts-ignore
  const isActive = filter((x) => !x.archived)
  // @ts-ignore
  const excluded = filter((x) => !exclude.includes(x.label))
  const toDropdown = map((x) => ({
    label: buildDisplay(x),
    value: x
  }))
  const toGroup = curry((label, options) => [{ label, options }])
  const toExchange = (x) => [
    {
      label: `Exchange Account`,
      value: x
    }
  ]
  const toCustodialDropdown = (currencyDetails) => [
    {
      label: buildCustodialDisplay(currencyDetails),
      value: {
        ...currencyDetails,
        label: 'Trading Account',
        type: ADDRESS_TYPES.CUSTODIAL
      }
    }
  ]

  const toInterestDropdown = (x) =>
    x
      ? [
          {
            label: buildInterestDisplay(x),
            value: {
              ...x,
              label: 'Interest Account',
              type: ADDRESS_TYPES.INTEREST
            }
          }
        ]
      : []

  const exchangeAddress = selectors.components.send.getPaymentsAccountExchange('BCH', state)
  const hasExchangeAddress = Remote.Success.is(exchangeAddress)

  const accountAddress = selectors.components.send.getPaymentsTradingAccountAddress('BCH', state)
  const hasAccountAddress = Remote.Success.is(accountAddress)

  const formatAddress = (addressData) => {
    const formattedAddress = {}
    return compose(
      (a) =>
        isNil(prop('label', addressData))
          ? assoc('label', prop('addr', addressData), a)
          : assoc('label', prop('label', addressData), a),
      (a) => assocPath(['value', 'type'], ADDRESS_TYPES.LEGACY, a),
      (a) => assocPath(['value', 'balance'], path(['info', 'final_balance'], addressData), a),
      (a) => assocPath(['value', 'coin'], coin, a),
      (a) => assocPath(['value', 'address'], prop('addr', addressData), a),
      (a) => assoc('value', prop('info', addressData), a)
    )(formattedAddress)
  }

  const formatImportedAddressesData = (addressesData) => {
    return map(formatAddress, addressesData)
  }

  const getAddressesData = () => {
    const importedAddresses = selectors.core.common.bch.getActiveAddresses(state)
    const filterRelevantAddresses = (addrs) =>
      filter((addr) => {
        // @ts-ignore
        return not(isNil(prop('priv', addr)))
      }, addrs)
    const relevantAddresses = lift(filterRelevantAddresses)(importedAddresses)

    const showCustodial = includeCustodial && !forceCustodialFirst
    const showCustodialWithAddress = includeCustodial && forceCustodialFirst && hasAccountAddress

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
      showCustodial || showCustodialWithAddress
        ? selectors.components.simpleBuy
            .getSBBalances(state)
            .map((x) => ({
              ...x.BCH,
              address: accountAddress ? accountAddress.data : null
            }))
            .map(toCustodialDropdown)
            .map(toGroup('Custodial Wallet'))
        : Remote.of([]),
      includeInterest
        ? selectors.components.interest
            .getInterestAccountBalance(state)
            .map((x) => x.BCH)
            .map(toInterestDropdown)
            .map(toGroup('Interest Account'))
        : Remote.of([]),
      excludeImported
        ? Remote.of([])
        : lift(formatImportedAddressesData)(relevantAddresses)
            .map(toGroup('Imported Addresses'))
            .map((x) =>
              set(
                // @ts-ignore
                compose(lensIndex(0), lensProp('options')),
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
      const orderArray = forceCustodialFirst ? [b3, b1, b2, b4, b5] : [b1, b2, b3, b4, b5]
      // @ts-ignore
      const data = reduce(concat, [], orderArray)
      if (includeAll) {
        return { data: prepend(allWallets, data) }
      }
      if (excludeHDWallets) {
        return { data: [allImportedAddresses] }
      }
      return { data }
    })
  }

  return getAddressesData()
}
