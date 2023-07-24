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

import { Exchange, Remote } from '@core'
import { ADDRESS_TYPES } from '@core/redux/payment/btc/utils'
import { EarnAccountBalanceResponseType } from '@core/types'
import { selectors } from 'data'
import { collapse } from 'utils/helpers'

const allWallets = {
  label: 'All',
  options: [
    {
      label: 'All BTC DeFi Wallets',
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
    includeActiveRewards?: boolean
    includeAll?: boolean
    includeCustodial?: boolean
    includeExchangeAddress?: boolean
    includeInterest?: boolean
    showCustodialFirst?: boolean
  }
) => {
  const {
    exclude = [],
    excludeHDWallets,
    excludeImported,
    forceCustodialFirst,
    includeActiveRewards,
    includeAll = true,
    includeCustodial,
    includeExchangeAddress,
    includeInterest
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
  const buildInterestDisplay = (x: EarnAccountBalanceResponseType['BTC']) => {
    return (
      `Rewards Account` +
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
              label: 'Passive Rewards Account',
              type: ADDRESS_TYPES.INTEREST
            }
          }
        ]
      : []

  const toActiveRewardsDropdown = (x) =>
    x
      ? [
          {
            label: buildInterestDisplay(x),
            value: {
              ...x,
              label: 'Active Rewards Account',
              type: ADDRESS_TYPES.ACTIVE
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
      excludeHDWallets
        ? Remote.of([])
        : selectors.core.common.btc
            .getActiveAccountsBalances(state)
            .map(excluded)
            .map(toDropdown)
            .map(toGroup('Wallet')),
      showCustodial || showCustodialWithAddress
        ? selectors.components.buySell
            .getBSBalances(state)
            .map((x) => ({
              ...x.BTC,
              address: accountAddress ? accountAddress.data : null
            }))
            .map(toCustodialDropdown)
            .map(toGroup('Custodial Wallet'))
        : Remote.of([]),
      includeInterest
        ? selectors.components.interest
            .getPassiveRewardsAccountBalance(state)
            .map((x) => x.BTC)
            .map(toInterestDropdown)
            .map(toGroup('Passive Rewards Account'))
        : Remote.of([]),
      includeActiveRewards
        ? selectors.components.interest
            .getActiveRewardsAccountBalance(state)
            .map((x) => x.BTC)
            .map(toActiveRewardsDropdown)
            .map(toGroup('Active Rewards Account'))
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
    ]).map(([b1, b2, b3, b4, b5, b6]) => {
      const orderArray = forceCustodialFirst ? [b3, b1, b2, b4, b5, b6] : [b1, b2, b3, b4, b5, b6]
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
