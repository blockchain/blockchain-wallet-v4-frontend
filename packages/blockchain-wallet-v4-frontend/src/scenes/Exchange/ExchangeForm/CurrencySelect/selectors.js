import {
  compose,
  includes,
  curry,
  map,
  path,
  prop,
  unnest,
  gt,
  length
} from 'ramda'

import { selectors, model } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

const {
  getAvailableSourceCoins,
  getAvailableTargetCoins
} = model.components.exchange
const { formatPair } = model.rates

const generateItems = ({ coin, accounts }, supportedCoins) =>
  accounts.map(account => ({
    value: {
      ...account,
      icon: path([coin, 'icons', 'default'], supportedCoins)
    },
    text: gt(length(accounts), 1)
      ? prop('label', account)
      : path([coin, 'displayName'], supportedCoins)
  }))

const generateGroups = curry(
  (accounts, supportedCoins, availableCurrencies) => {
    const items = compose(
      unnest,
      map(item => generateItems(item, supportedCoins)),
      map(coin => ({ coin, accounts: prop(coin, accounts) }))
    )(availableCurrencies)
    return [{ group: '', items }]
  }
)

export const getData = createDeepEqualSelector(
  [
    selectors.components.exchange.getActiveAccounts,
    state => selectors.core.walletOptions.getSupportedCoins(state).getOrFail(),
    (state, ownProps) => ownProps
  ],
  (accounts, supportedCoins, { availablePairs, sourceCoin, targetCoin }) => {
    const availableSourceCoins = getAvailableSourceCoins(availablePairs)
    const availableTargetCoins = getAvailableTargetCoins(availablePairs)
    const generateActiveGroups = generateGroups(accounts, supportedCoins)
    return {
      fromElements: generateActiveGroups(availableSourceCoins),
      toElements: generateActiveGroups(availableTargetCoins),
      swapDisabled: !includes(
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
