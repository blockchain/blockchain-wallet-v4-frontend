import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
// @ts-ignore
import { concat, curry, filter, has, map, prop, reduce, sequence } from 'ramda'
import {
  Erc20CoinType,
  InterestAccountBalanceType,
  SupportedCoinsType
} from 'core/types'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'

import { selectors } from 'data'

export const getEthData = (
  state,
  ownProps: {
    exclude?: Array<string>
    excludeLockbox?: boolean
    includeCustodial?: boolean
    includeExchangeAddress?: boolean
    includeInterest?: boolean
  }
) => {
  const {
    exclude = [],
    excludeLockbox,
    includeExchangeAddress,
    includeCustodial,
    includeInterest
  } = ownProps
  const displayEthFixed = data => {
    const etherAmount = Exchange.convertEtherToEther(data)
    return Exchange.displayEtherToEther({
      value: Number(etherAmount.value).toFixed(8),
      fromUnit: 'ETH',
      toUnit: 'ETH'
    })
  }
  const buildDisplay = wallet => {
    if (has('balance', wallet)) {
      let ethDisplay = displayEthFixed({
        value: wallet.balance,
        fromUnit: 'WEI',
        toUnit: 'ETH'
      })
      return wallet.label + ` (${ethDisplay})`
    }
    return wallet.label
  }
  const buildCustodialDisplay = x => {
    return (
      `ETH Trading Wallet` +
      ` (${Exchange.displayEtherToEther({
        value: x ? x.available : 0,
        fromUnit: 'WEI',
        toUnit: 'ETH'
      })})`
    )
  }
  const buildInterestDisplay = (x: InterestAccountBalanceType['ETH']) => {
    return (
      `ETH Interest Wallet` +
      ` (${Exchange.displayEtherToEther({
        value: x ? x.balance : 0,
        fromUnit: 'WEI',
        toUnit: 'ETH'
      })})`
    )
  }
  // @ts-ignore
  const excluded = filter(x => !exclude.includes(x.label))
  const toDropdown = map(x => ({ label: buildDisplay(x), value: x }))
  const toGroup = curry((label, options) => [{ label, options, value: '' }])
  const toExchange = x => [{ label: `Exchange ETH Address`, value: x }]
  const toCustodialDropdown = x => [
    {
      label: buildCustodialDisplay(x),
      value: {
        ...x,
        type: ADDRESS_TYPES.CUSTODIAL,
        label: 'ETH Trading Wallet'
      }
    }
  ]

  const toInterestDropdown = x => [
    {
      label: buildInterestDisplay(x),
      value: {
        ...x,
        type: ADDRESS_TYPES.INTEREST,
        label: 'ETH Interest Wallet'
      }
    }
  ]

  const exchangeAddress = selectors.components.send.getPaymentsAccountExchange(
    'ETH',
    state
  )
  const hasExchangeAddress = Remote.Success.is(exchangeAddress)

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
      includeCustodial
        ? selectors.components.simpleBuy
            .getSBBalances(state)
            .map<any, any>(prop('ETH'))
            .map(toCustodialDropdown)
            .map(toGroup('Custodial Wallet'))
        : Remote.of([]),
      includeInterest
        ? selectors.components.interest
            .getInterestAccountBalance(state)
            .map<any, any>(prop('ETH'))
            .map(toInterestDropdown)
            .map(toGroup('Interest Wallet'))
        : Remote.of([]),
      excludeLockbox
        ? Remote.of([])
        : selectors.core.common.eth
            .getLockboxEthBalances(state)
            .map(excluded)
            .map(toDropdown)
            .map(toGroup('Lockbox'))
    ]).map(([b1, b2, b3, b4]) => ({
      // @ts-ignore
      data: reduce(concat, [], [b1, b2, b3, b4])
    }))
  }

  return getAddressesData()
}

export const getErc20Data = (
  state,
  ownProps: {
    coin: Erc20CoinType
    exclude?: Array<string>
    includeCustodial?: boolean
    includeExchangeAddress?: boolean
  }
) => {
  const {
    coin,
    exclude = [],
    includeExchangeAddress,
    includeCustodial
  } = ownProps
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const supportedCoins = supportedCoinsR.getOrElse({}) as SupportedCoinsType
  const displayErc20Fixed = data => {
    // TODO: ERC20 make more generic
    if (coin === 'PAX') {
      const paxAmount = Exchange.convertPaxToPax(data)
      return Exchange.displayPaxToPax({
        value: Number(paxAmount.value).toFixed(8),
        fromUnit: 'PAX',
        toUnit: 'PAX'
      })
    }
    if (coin === 'USDT') {
      const usdtAmount = Exchange.convertUsdtToUsdt(data)
      return Exchange.displayUsdtToUsdt({
        value: Number(usdtAmount.value).toFixed(8),
        fromUnit: 'USDT',
        toUnit: 'USDT'
      })
    }
    return {}
  }
  const buildCustodialDisplay = (
    x,
    coin: Erc20CoinType,
    displayName: string
  ) => {
    return (
      `${displayName} Trading Wallet` +
      ` (${displayErc20Fixed({
        value: x ? x.available : 0,
        fromUnit: 'WEI',
        toUnit: coin
      })})`
    )
  }

  // @ts-ignore
  const excluded = filter(x => !exclude.includes(x.label))
  const buildDisplay = wallet => {
    let erc20BalanceDisplay = displayErc20Fixed({
      value: wallet.balance,
      fromUnit: 'WEI',
      toUnit: coin
    })
    return wallet.label + ` (${erc20BalanceDisplay})`
  }
  const toDropdown = map(x => ({
    label: buildDisplay(x),
    value: x
  }))
  const toGroup = curry((label, options) => [{ label, options }])
  const toExchange = x => [
    {
      label: `Exchange ${coin} Address`,
      value: x
    }
  ]
  const toCustodialDropdown = x => [
    {
      label: buildCustodialDisplay(x, coin, supportedCoins[coin].displayName),
      value: {
        ...x,
        type: ADDRESS_TYPES.CUSTODIAL,
        label: `${supportedCoins[coin].coinTicker} Trading Wallet`
      }
    }
  ]

  const exchangeAddress = selectors.components.send.getPaymentsAccountExchange(
    coin,
    state
  )
  const hasExchangeAddress = Remote.Success.is(exchangeAddress)

  const getAddressesData = () => {
    return sequence(Remote.of, [
      selectors.core.common.eth
        .getErc20AccountBalances(state, coin)
        .map(excluded)
        .map(toDropdown)
        .map(toGroup('Wallet')),
      Remote.of([]),
      includeCustodial
        ? selectors.components.simpleBuy
            .getSBBalances(state)
            .map<any, any>(prop(coin))
            .map(toCustodialDropdown)
            .map(toGroup('Custodial Wallet'))
        : Remote.of([]),
      includeExchangeAddress && hasExchangeAddress
        ? exchangeAddress.map(toExchange).map(toGroup('Exchange'))
        : Remote.of([])
    ]).map(([b1, b2, b3, b4]) => ({
      // @ts-ignore
      data: reduce(concat, [], [b1, b2, b3, b4])
    }))
  }

  return getAddressesData()
}
