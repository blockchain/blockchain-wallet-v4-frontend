import { concat, curry, filter, has, map, sequence } from 'ramda'
import { Exchange, Remote } from 'blockchain-wallet-v4/src'
import { selectors } from 'data'

export const getEthData = (state, ownProps) => {
  const { exclude = [], excludeLockbox } = ownProps
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
            .map(toGroup('Lockbox'))
    ]).map(([b1, b2]) => ({ data: concat(b1, b2) }))
  }

  return getAddressesData()
}

export const getErc20Data = (state, ownProps) => {
  const { coin, exclude = [] } = ownProps
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
  const buildDisplay = (label, balance) => {
    let erc20BalanceDisplay = displayErc20Fixed({
      value: balance,
      fromUnit: 'WEI',
      toUnit: coin
    })
    return label + ` (${erc20BalanceDisplay})`
  }
  const toDropdown = c => [
    {
      label: buildDisplay(c.label, c.balance),
      value: c
    }
  ]
  const toGroup = curry((label, options) => [{ label, options }])

  const getAddressesData = () => {
    return sequence(Remote.of, [
      selectors.core.common.eth
        .getErc20AccountBalances(state, coin)
        .map(excluded)
        .map(toDropdown)
        .map(toGroup('Wallet')),
      Remote.of([])
    ]).map(([b1, b2]) => ({ data: concat(b1, b2) }))
  }

  return getAddressesData()
}
