import {
  compose,
  curry,
  gt,
  includes,
  length,
  map,
  path,
  prop,
  propEq,
  reject,
  sort,
  unnest
} from 'ramda'

import { createDeepEqualSelector } from 'services/ReselectHelper'
import { model, selectors } from 'data'

const {
  getAvailableSourceCoins,
  getAvailableTargetCoins
} = model.components.exchange
const { formatPair } = model.rates

const generateItems = ({ coin, accounts }, supportedCoins) =>
  accounts.map(account => {
    account.icon = path([coin, 'icons', 'circleFilled'], supportedCoins)
    return {
      value: account,
      text: gt(length(accounts), 1)
        ? prop('label', account)
        : path([coin, 'displayName'], supportedCoins)
    }
  })

const coinOrder = ['PAX', 'BTC', 'BCH', 'ETH', 'XLM']
const generateGroups = curry(
  (
    accounts,
    supportedCoins,
    sourceCoin,
    targetCoin,
    availableCurrencies,
    isToElements
  ) => {
    let items = compose(
      unnest,
      map(item => generateItems(item, supportedCoins)),
      map(coin => ({ coin, accounts: prop(coin, accounts) })),
      reject(coin => !path([coin, 'invited'], supportedCoins)),
      sort((a, b) => coinOrder.indexOf(a) - coinOrder.indexOf(b))
    )(availableCurrencies)

    // if this is the 'to' select box, then we will filter out the sourceCoin from items
    // otherwise if this is the 'from' select box, then we will filter out the targetCoin from items
    if (isToElements) {
      items = reject(({ value }) => propEq('coin', sourceCoin)(value), items)
    } else {
      items = reject(({ value }) => propEq('coin', targetCoin)(value), items)
    }

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
    const generateActiveGroups = generateGroups(
      accounts,
      supportedCoins,
      sourceCoin,
      targetCoin
    )
    return {
      fromElements: generateActiveGroups(availableSourceCoins, false),
      toElements: generateActiveGroups(availableTargetCoins, true),
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
