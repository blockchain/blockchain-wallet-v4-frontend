import {
  compose,
  curry,
  equals,
  includes,
  map,
  not,
  path,
  prop,
  reject,
  sort
} from 'ramda'

import {
  CoinType,
  NO_SUPPORTED_COINS,
  SupportedWalletCurrenciesType
} from 'core/types'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { model, selectors } from 'data'

const {
  getAvailableSourceCoins,
  getAvailableTargetCoins
} = model.components.exchange
const { formatPair } = model.rates

const generateItems = (
  { coin, accounts },
  supportedCoins: SupportedWalletCurrenciesType
) => {
  const options = accounts.map(account => {
    account.icon = path([coin, 'icons', 'circleFilled'], supportedCoins)
    return {
      value: account,
      text: prop('label', account)
    }
  })

  const label = supportedCoins[coin as CoinType].displayName

  return { label, options }
}

const coinOrder = ['BTC', 'ETH', 'BCH', 'XLM', 'PAX', 'USDT']
const generateGroups = curry(
  (
    accounts,
    supportedCoins: SupportedWalletCurrenciesType,
    sourceCoin,
    targetCoin,
    availableCurrencies
  ) => {
    let groups = compose(
      // unnest,
      // @ts-ignore
      map(item => generateItems(item, supportedCoins)),
      // @ts-ignore
      map((coin: CoinType) => ({ coin, accounts: prop(coin, accounts) })),
      // @ts-ignore
      reject((coin: CoinType) => !supportedCoins[coin].invited),
      // @ts-ignore
      sort((a, b) => coinOrder.indexOf(a) - coinOrder.indexOf(b))
    )(availableCurrencies)

    return groups
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
  not(equals(prev.fromElements, next.fromElements)) ||
  not(equals(prev.toElements, next.toElements))
