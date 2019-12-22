import { concat, curry, filter, has, map, reduce, sequence } from 'ramda'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

export const getEthData = (state, ownProps) => {
  const { exclude = [], excludeLockbox, includeExchangeAddress } = ownProps
  const displayEtherFixed = data => {
    const etherAmount = Exchange.convertEtherToEther(data)
    return Exchange.displayEtherToEther({
      value: Number(etherAmount.value).toFixed(8),
      fromUnit: 'ETH',
      toUnit: 'ETH'
    })
  }
  const buildDisplay = wallet => {
    if (has('balance', wallet)) {
      let ethDisplay = displayEtherFixed({
        value: wallet.balance,
        fromUnit: 'WEI',
        toUnit: 'ETH'
      })
      return wallet.label + ` (${ethDisplay})`
    }
    return wallet.label
  }
  const excluded = filter(x => !exclude.includes(x.label))
  const toDropdown = map(x => ({ label: buildDisplay(x), value: x }))
  const toGroup = curry((label, options) => [{ label, options, value: '' }])
  const toExchange = x => [{ label: `Exchange ETH Address`, value: x }]

  const exchangeAddress = selectors.components.send.getPaymentsAccountExchange(
    'ETH',
    state
  )
  const hasExchangeAddress = Remote.Success.is(exchangeAddress)

  const getAddressesData = () => {
    return sequence(Remote.of, [
      selectors.core.common.eth
        .getAccountBalances(state)
        .map(excluded)
        .map(toDropdown)
        .map(toGroup('Wallet')),
      excludeLockbox
        ? Remote.of([])
        : selectors.core.common.eth
            .getLockboxEthBalances(state)
            .map(excluded)
            .map(toDropdown)
            .map(toGroup('Lockbox')),
      includeExchangeAddress && hasExchangeAddress
        ? exchangeAddress.map(toExchange).map(toGroup('Exchange'))
        : Remote.of([])
    ]).map(([b1, b2, b3]) => ({ data: reduce(concat, [], [b1, b2, b3]) }))
  }

  return getAddressesData()
}

export const getErc20Data = (state, ownProps) => {
  const { coin, exclude = [], includeExchangeAddress } = ownProps
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
    return {}
  }
  const excluded = filter(x => !exclude.includes(x.label))
  const buildDisplay = wallet => {
    let erc20BalanceDisplay = displayErc20Fixed({
      value: wallet.balance,
      fromUnit: 'WEI',
      toUnit: coin
    })
    return wallet.label + ` (${erc20BalanceDisplay})`
  }
  const toDropdown = map(x => ({ label: buildDisplay(x), value: x }))
  const toGroup = curry((label, options) => [{ label, options }])
  const toExchange = x => [{ label: `Exchange ${coin} Address`, value: x }]

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
      includeExchangeAddress && hasExchangeAddress
        ? exchangeAddress.map(toExchange).map(toGroup('Exchange'))
        : Remote.of([])
    ]).map(([b1, b2, b3]) => ({ data: reduce(concat, [], [b1, b2, b3]) }))
  }

  return getAddressesData()
}
