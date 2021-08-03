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
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
import { InterestAccountBalanceType } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { collapse } from 'utils/helpers'

const allWallets = {
  label: 'All',
  options: [
    {
      label: 'All BTC Private Key Wallets',
      value: 'all'
    }
  ]
}

const allImportedAddresses = {
  label: 'Imported Addresses',
  options: [
    {
      label: 'All Imported BTC Addresses',
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
    forceCustodialFirst?: boolean
    includeAll?: boolean
    includeCustodial?: boolean
    includeExchangeAddress?: boolean
    includeInterest?: boolean
  }
) => {
  const {
    exclude = [],
    excludeHDWallets,
    excludeImported,
    includeAll = true,
    includeCustodial,
    includeExchangeAddress,
    includeInterest,
    forceCustodialFirst
  } = ownProps

  const buildDisplay = (wallet) => {
    const label = collapse(wallet.label)
    if (has('balance', wallet)) {
      const btcDisplay = Exchange.displayCoinToCoin({
        coin: 'BTC',
        value: wallet.balance
      })
      return `${label} (${btcDisplay})`
    }
    return label
  }
  const buildCustodialDisplay = (x) => {
    return (
      `Trading Account` +
      ` (${Exchange.displayCoinToCoin({
        coin: 'BTC',
        value: x ? x.available : 0
      })})`
    )
  }
  const buildInterestDisplay = (x: InterestAccountBalanceType['BTC']) => {
    return (
      `Interest Account` +
      ` (${Exchange.displayCoinToCoin({
        coin: 'BTC',
        value: x ? x.balance : 0
      })})`
    )
  }
  // @ts-ignore
  const excluded = filter((x) => !exclude.includes(x.label))
  const toDropdown = map((x) => ({ label: buildDisplay(x), value: x }))
  const toGroup = curry((label, options) => [{ label, options }])
  const toExchange = (x) => [{ label: `Exchange Account`, value: x }]
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

  const exchangeAddress = selectors.components.send.getPaymentsAccountExchange('BTC', state)
  const hasExchangeAddress = Remote.Success.is(exchangeAddress)

  const accountAddress = selectors.components.send.getPaymentsTradingAccountAddress('BTC', state)
  const hasAccountAddress = Remote.Success.is(accountAddress)

  const showCustodial = includeCustodial && !forceCustodialFirst
  const showCustodialWithAddress = includeCustodial && forceCustodialFirst && hasAccountAddress

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
      showCustodial || showCustodialWithAddress
        ? selectors.components.simpleBuy
            .getSBBalances(state)
            .map((x) => ({
              ...x.BTC,
              address: accountAddress ? accountAddress.data : null
            }))
            .map(toCustodialDropdown)
            .map(toGroup('Custodial Wallet'))
        : Remote.of([]),
      includeInterest
        ? selectors.components.interest
            .getInterestAccountBalance(state)
            .map((x) => x.BTC)
            .map(toInterestDropdown)
            .map(toGroup('Interest Account'))
        : Remote.of([]),
      excludeImported
        ? Remote.of([])
        : selectors.core.common.btc
            .getAddressesBalances(state)
            .map(toDropdown)
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
            )
    ]).map(([b1, b2, b3, b4, b5]) => {
      const orderArray = forceCustodialFirst ? [b3, b1, b2, b4, b5] : [b1, b2, b3, b4, b5]
      // @ts-ignore
      const data = reduce(concat, [], orderArray) as array

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
