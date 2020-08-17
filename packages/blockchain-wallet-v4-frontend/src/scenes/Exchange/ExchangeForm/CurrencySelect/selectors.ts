import {
  compose,
  curry,
  equals,
  gt,
  includes,
  length,
  map,
  not,
  path,
  prop,
  propEq,
  reject,
  sort,
  unnest
} from 'ramda'

import {
  CoinType,
  NO_SUPPORTED_COINS,
  SupportedWalletCurrenciesType
} from 'core/types'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { model, selectors } from 'data'
import { SwapAccountType } from './types'

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

const coinOrder = ['BTC', 'ETH', 'BCH', 'XLM', 'PAX', 'USDT']
const generateGroups = curry(
  (
    accounts,
    supportedCoins: SupportedWalletCurrenciesType,
    sourceCoin,
    targetCoin,
    availableCurrencies,
    isToElements
  ) => {
    let items = compose(
      unnest,
      // @ts-ignore
      map(item => generateItems(item, supportedCoins)),
      // @ts-ignore
      map((coin: CoinType) => ({ coin, accounts: prop(coin, accounts) })),
      // @ts-ignore
      reject((coin: CoinType) => !supportedCoins[coin].invited),
      // @ts-ignore
      sort((a, b) => coinOrder.indexOf(a) - coinOrder.indexOf(b))
    )(availableCurrencies)

    // if this is the 'to' select box, then we will filter out the sourceCoin from items
    // otherwise if this is the 'from' select box, then we will filter out the targetCoin from items
    if (isToElements) {
      items = reject(({ value }) => propEq('coin', sourceCoin)(value), items)
    } else {
      items = reject(({ value }) => propEq('coin', targetCoin)(value), items)
    }

    return [{ group: '', items: items as Array<SwapAccountType> }]
  }
)

export const getData = createDeepEqualSelector(
  [
    selectors.components.exchange.getActiveAccounts,
    state =>
      selectors.core.walletOptions
        .getSupportedCoins(state)
        .getOrFail(NO_SUPPORTED_COINS),
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
  not(equals(prev.fromElements, next.fromElements)) ||
  not(equals(prev.toElements, next.toElements))
