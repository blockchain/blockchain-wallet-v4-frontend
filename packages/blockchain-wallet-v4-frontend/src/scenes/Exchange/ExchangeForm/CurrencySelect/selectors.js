import {
  always,
  compose,
  contains,
  curry,
  flip,
  map,
  prop,
  unnest
} from 'ramda'

import { selectors, model } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

const {
  getAvailableSourceCoins,
  getAvailableTargetCoins
} = model.components.exchange
const { formatPair } = model.rates

const getCoinFullName = flip(prop)({
  BTC: 'Bitcoin',
  BCH: 'Bitcoin Cash',
  BSV: 'Bitcoin SV',
  ETH: 'Ether',
  XLM: 'Stellar'
})

const generateItems = ({ coin, accounts }) => {
  const getText =
    accounts.length === 1 ? always(getCoinFullName(coin)) : prop('label')
  return accounts.map(account => ({
    value: account,
    text: getText(account)
  }))
}

const generateGroups = curry((accounts, availableCurrencies) => {
  const items = compose(
    unnest,
    map(generateItems),
    map(coin => ({ coin, accounts: prop(coin, accounts) }))
  )(availableCurrencies)
  return [{ group: '', items }]
})

export const getData = createDeepEqualSelector(
  [
    selectors.components.exchange.getActiveAccounts,
    (state, ownProps) => ownProps
  ],
  (accounts, { availablePairs, sourceCoin, targetCoin }) => {
    const availableSourceCoins = getAvailableSourceCoins(availablePairs)
    const availableTargetCoins = getAvailableTargetCoins(availablePairs)
    const generateActiveGroups = generateGroups(accounts)
    return {
      fromElements: generateActiveGroups(availableSourceCoins),
      toElements: generateActiveGroups(availableTargetCoins),
      swapDisabled: !contains(
        formatPair(targetCoin, sourceCoin),
        availablePairs
      )
    }
  }
)

export const shouldUpdate = (prev, next) =>
  prev.swapDisabled !== next.swapDisabled ||
  prev.fromElements !== next.fromElements ||
  prev.toElements !== next.toElements
