import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'
// @ts-ignore
import { concat, curry, filter, has, map, reduce, sequence } from 'ramda'

import {
  Erc20CoinType,
  InterestAccountBalanceType,
  SupportedWalletCurrenciesType
} from 'core/types'

import { Exchange, Remote } from 'blockchain-wallet-v4/src'

import { selectors } from 'data'

export const getEthData = (
  state,
  ownProps: {
    exclude?: Array<string>
    excludeLockbox?: boolean
    forceCustodialFirst?: boolean
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
    includeInterest,
    forceCustodialFirst
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
  const toCustodialDropdown = currencyDetails => [
    {
      label: buildCustodialDisplay(currencyDetails),
      value: {
        ...currencyDetails,
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

  const accountAddress = selectors.components.send.getPaymentsTradingAccountAddress(
    'ETH',
    state
  )
  const hasAccountAddress = Remote.Success.is(accountAddress)

  const showCustodial = includeCustodial && !forceCustodialFirst
  const showCustodialWithAddress =
    includeCustodial && forceCustodialFirst && hasAccountAddress

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
        ? selectors.components.simpleBuy
            .getSBBalances(state)
            .map(x => ({
              ...x.ETH,
              address: accountAddress ? accountAddress.data : null
            }))
            .map(toCustodialDropdown)
            .map(toGroup('Custodial Wallet'))
        : Remote.of([]),
      includeInterest
        ? selectors.components.interest
            .getInterestAccountBalance(state)
            .map(x => x.ETH)
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
    ]).map(([b1, b2, b3, b4, b5]) => {
      const orderArray = forceCustodialFirst
        ? [b3, b1, b2, b4, b5]
        : [b1, b2, b3, b4, b5]
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
    coin: Erc20CoinType
    exclude?: Array<string>
    forceCustodialFirst?: boolean
    includeCustodial?: boolean
    includeExchangeAddress?: boolean
    includeInterest?: boolean
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
  const supportedCoinsR = selectors.core.walletOptions.getSupportedCoins(state)
  const supportedCoins = supportedCoinsR.getOrElse(
    {} as SupportedWalletCurrenciesType
  )

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

  const buildInterestDisplay = (
    coin: Erc20CoinType,
    displayName: string,
    x
  ) => {
    return (
      `${displayName} Interest Wallet` +
      ` (${Exchange.displayEtherToEther({
        value: x ? x.balance : 0,
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
  const toCustodialDropdown = currencyDetails => [
    {
      label: buildCustodialDisplay(
        currencyDetails,
        coin,
        supportedCoins[coin].displayName
      ),
      value: {
        ...currencyDetails,
        type: ADDRESS_TYPES.CUSTODIAL,
        label: `${supportedCoins[coin].coinTicker} Trading Wallet`
      }
    }
  ]

  const toInterestDropdown = x => [
    {
      label: buildInterestDisplay(x, coin, supportedCoins[coin].displayName),
      value: {
        ...x,
        type: ADDRESS_TYPES.INTEREST,
        label: `${supportedCoins[coin].coinTicker} Interest Wallet`
      }
    }
  ]

  const exchangeAddress = selectors.components.send.getPaymentsAccountExchange(
    coin,
    state
  )
  const hasExchangeAddress = Remote.Success.is(exchangeAddress)

  const accountAddress = selectors.components.send.getPaymentsTradingAccountAddress(
    coin,
    state
  )
  const hasAccountAddress = Remote.Success.is(accountAddress)
  const showCustodial = includeCustodial && !forceCustodialFirst
  const showCustodialWithAddress =
    includeCustodial && forceCustodialFirst && hasAccountAddress

  const getAddressesData = () => {
    return sequence(Remote.of, [
      selectors.core.common.eth
        .getErc20AccountBalances(state, coin)
        .map(excluded)
        .map(toDropdown)
        .map(toGroup('Wallet')),
      Remote.of([]),
      showCustodial || showCustodialWithAddress
        ? selectors.components.simpleBuy
            .getSBBalances(state)
            .map(x => ({
              ...x[coin],
              address: accountAddress ? accountAddress.data : null
            }))
            .map(toCustodialDropdown)
            .map(toGroup('Custodial Wallet'))
        : Remote.of([]),
      includeInterest
        ? selectors.components.interest
            .getInterestAccountBalance(state)
            .map(x => x[coin])
            .map(toInterestDropdown)
            .map(toGroup('Interest Wallet'))
        : Remote.of([]),
      includeExchangeAddress && hasExchangeAddress
        ? exchangeAddress.map(toExchange).map(toGroup('Exchange'))
        : Remote.of([])
    ]).map(([b1, b2, b3, b4]) => {
      const orderArray = forceCustodialFirst
        ? [b2, b1, b3, b4]
        : [b1, b2, b3, b4]
      // @ts-ignore
      const data = reduce(concat, [], orderArray)
      return { data }
    })
  }

  return getAddressesData()
}
