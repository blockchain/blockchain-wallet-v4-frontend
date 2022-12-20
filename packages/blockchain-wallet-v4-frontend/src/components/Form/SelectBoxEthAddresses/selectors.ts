// @ts-ignore
import { concat, curry, filter, has, map, reduce, sequence } from 'ramda'

import { Exchange, Remote } from '@core'
import { ADDRESS_TYPES } from '@core/redux/payment/btc/utils'
import { selectors } from 'data'

const { CUSTODIAL, INTEREST, STAKING } = ADDRESS_TYPES

const buildAccountDisplay = ({ account, coin, type }) => {
  let accountType
  switch (type) {
    case CUSTODIAL:
      accountType = 'Trading Account'
      break
    case INTEREST:
      accountType = 'Rewards Account'
      break
    case STAKING:
      accountType = 'Staking Account'
      break

    default:
      return
  }

  return (
    `${accountType}` +
    ` (${Exchange.displayCoinToCoin({
      coin,
      value: account ? account.available : 0
    })})`
  )
}

export const getEthData = (
  state,
  ownProps: {
    exclude?: Array<string>
    forceCustodialFirst?: boolean
    includeCustodial?: boolean
    includeExchangeAddress?: boolean
    includeInterest?: boolean
    includeStaking?: boolean
  }
) => {
  const {
    exclude = [],
    includeExchangeAddress,
    includeCustodial,
    includeInterest,
    includeStaking,
    forceCustodialFirst
  } = ownProps

  const displayEthFixed = (data) => {
    return Exchange.displayCoinToCoin({ coin: 'ETH', value: data.value })
  }
  const buildDisplay = (wallet) => {
    if (has('balance', wallet)) {
      const ethDisplay = displayEthFixed({
        coin: 'ETH',
        fromUnit: 'WEI',
        value: wallet.balance
      })
      return `${wallet.label} (${ethDisplay})`
    }
    return wallet.label
  }

  // @ts-ignore
  const excluded = filter((x) => !exclude.includes(x.label))
  const toDropdown = map((x) => ({ label: buildDisplay(x), value: x }))
  const toGroup = curry((label, options) => [{ label, options, value: '' }])
  const toExchange = (x) => [{ label: `ETH Exchange Account`, value: x }]
  const toCustodialDropdown = (currencyDetails) => [
    {
      label: buildAccountDisplay({ account: currencyDetails, coin: 'ETH', type: CUSTODIAL }),
      value: {
        ...currencyDetails,
        label: 'Trading Account',
        type: CUSTODIAL
      }
    }
  ]

  const toInterestDropdown = (account) =>
    account
      ? [
          {
            label: buildAccountDisplay({ account, coin: 'ETH', type: INTEREST }),
            value: {
              ...account,
              label: 'Rewards Account',
              type: INTEREST
            }
          }
        ]
      : []

  const toStakingDropdown = (account) =>
    account
      ? [
          {
            label: buildAccountDisplay({ account, coin: 'ETH', type: STAKING }),
            value: {
              ...account,
              label: `Staking Account`,
              type: STAKING
            }
          }
        ]
      : []

  const exchangeAddress = selectors.components.send.getPaymentsAccountExchange('ETH', state)
  const hasExchangeAddress = Remote.Success.is(exchangeAddress)

  const accountAddress = selectors.components.send.getPaymentsTradingAccountAddress('ETH', state)
  const hasAccountAddress = Remote.Success.is(accountAddress)

  const showCustodial = includeCustodial && !forceCustodialFirst
  const showCustodialWithAddress = includeCustodial && forceCustodialFirst && hasAccountAddress

  const getAddressesData = () => {
    return sequence(Remote.of, [
      includeExchangeAddress && hasExchangeAddress
        ? exchangeAddress.map(toExchange).map(toGroup('Exchange'))
        : Remote.of([]),
      selectors.core.common.eth
        .getAccountBalances(state)
        .map(excluded)
        .map(toDropdown)
        .map(toGroup('Wallet')),
      showCustodial || showCustodialWithAddress
        ? selectors.components.buySell
            .getBSBalances(state)
            .map((x) => ({
              ...x.ETH,
              address: accountAddress ? accountAddress.data : null
            }))
            .map(toCustodialDropdown)
            .map(toGroup('Custodial Wallet'))
        : Remote.of([]),
      includeInterest
        ? selectors.components.interest
            .getPassiveRewardsAccountBalance(state)
            .map((x) => x.ETH)
            .map(toInterestDropdown)
            .map(toGroup('Rewards Account'))
        : Remote.of([]),
      includeStaking
        ? selectors.components.interest
            .getStakingAccountBalance(state)
            .map((x) => x.ETH)
            .map(toStakingDropdown)
            .map(toGroup('Staking Account'))
        : Remote.of([])
    ]).map(([b1, b2, b3, b4, b5]) => {
      const orderArray = forceCustodialFirst ? [b3, b1, b2, b4, b5] : [b1, b2, b3, b4, b5]
      // @ts-ignore
      const data = reduce(concat, [], orderArray)
      return { data }
    })
  }

  return getAddressesData()
}

export const getErc20Data = (
  state,
  ownProps: {
    coin: string
    exclude?: Array<string>
    forceCustodialFirst?: boolean
    includeCustodial?: boolean
    includeExchangeAddress?: boolean
    includeInterest?: boolean
    includeStaking?: boolean
  }
) => {
  const {
    coin,
    exclude = [],
    includeExchangeAddress,
    includeCustodial,
    includeInterest,
    forceCustodialFirst
  } = ownProps
  const displayErc20Fixed = ({ value }) => {
    return Exchange.displayCoinToCoin({
      coin,
      value
    })
  }

  // @ts-ignore
  const excluded = filter((account) => !exclude.includes(account.label))
  const buildDisplay = (wallet) => {
    const erc20BalanceDisplay = displayErc20Fixed({
      value: wallet.balance
    })
    return `${wallet.label} (${erc20BalanceDisplay})`
  }
  const toDropdown = map((x) => ({
    label: buildDisplay(x),
    value: x
  }))
  const toGroup = curry((label, options) => [{ label, options }])
  const toExchange = (x) => [
    {
      label: 'Exchange Account',
      value: x
    }
  ]
  const toCustodialDropdown = (account) => [
    {
      label: buildAccountDisplay({ account, coin, type: CUSTODIAL }),
      value: {
        ...account,
        label: `Trading Account`,
        type: CUSTODIAL
      }
    }
  ]

  const toInterestDropdown = (account) =>
    account
      ? [
          {
            label: buildAccountDisplay({ account, coin, type: INTEREST }),
            value: {
              ...account,
              label: `Rewards Account`,
              type: INTEREST
            }
          }
        ]
      : []

  const exchangeAddress = selectors.components.send.getPaymentsAccountExchange(coin, state)
  const hasExchangeAddress = Remote.Success.is(exchangeAddress)

  const accountAddress = selectors.components.send.getPaymentsTradingAccountAddress(coin, state)
  const hasAccountAddress = Remote.Success.is(accountAddress)
  const showCustodial = includeCustodial && !forceCustodialFirst
  const showCustodialWithAddress = includeCustodial && forceCustodialFirst && hasAccountAddress

  const getAddressesData = () => {
    return sequence(Remote.of, [
      includeExchangeAddress && hasExchangeAddress
        ? exchangeAddress.map(toExchange).map(toGroup('Exchange'))
        : Remote.of([]),
      selectors.core.common.eth
        .getErc20AccountBalances(state, coin)
        .map(excluded)
        .map(toDropdown)
        .map(toGroup('Wallet')),
      Remote.of([]),
      showCustodial || showCustodialWithAddress
        ? selectors.components.buySell
            .getBSBalances(state)
            .map((x) => ({
              ...x[coin],
              address: accountAddress ? accountAddress.data : null
            }))
            .map(toCustodialDropdown)
            .map(toGroup('Custodial Wallet'))
        : Remote.of([]),
      includeInterest
        ? selectors.components.interest
            .getPassiveRewardsAccountBalance(state)
            .map((x) => x[coin])
            .map(toInterestDropdown)
            .map(toGroup('Rewards Account'))
        : Remote.of([])
    ]).map(([b1, b2, b3, b4]) => {
      const orderArray = forceCustodialFirst ? [b2, b1, b3, b4] : [b1, b2, b3, b4]
      // @ts-ignore
      const data = reduce(concat, [], orderArray)
      return { data }
    })
  }

  return getAddressesData()
}
