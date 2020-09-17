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
import { EXCHANGE_FORM } from 'data/components/exchange/model'
import { GroupHeadingLabelType } from './types'
import { model, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { SwapAccountType, SwapFormValuesType } from 'data/types'

const {
  getAvailableSourceCoins,
  getAvailableTargetCoins
} = model.components.exchange
const { formatPair } = model.rates

const generateItems = (
  { coin, accounts },
  supportedCoins: SupportedWalletCurrenciesType
) => {
  const options: Array<{ text: string; value: SwapAccountType }> = accounts.map(
    account => {
      account.icon = path([coin, 'icons', 'circleFilled'], supportedCoins)
      return {
        value: account,
        text: prop('label', account)
      }
    }
  )

  const label: GroupHeadingLabelType = {
    coin,
    name: supportedCoins[coin as CoinType].displayName,
    icon: supportedCoins[coin as CoinType].icons.circleFilled
  }

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
    selectors.form.getFormValues(EXCHANGE_FORM),
    selectors.components.exchange.getActiveAccounts,
    (state: RootState) =>
      selectors.core.walletOptions
        .getSupportedCoins(state)
        .getOrFail(NO_SUPPORTED_COINS),
    (state, ownProps) => ownProps
  ],
  (
    formValues: SwapFormValuesType,
    accounts,
    supportedCoins,
    { availablePairs, sourceCoin, targetCoin }
  ) => {
    const availableSourceCoins = getAvailableSourceCoins(availablePairs)
    const availableTargetCoins = getAvailableTargetCoins(availablePairs)
    const generateActiveGroups = generateGroups(
      accounts,
      supportedCoins,
      sourceCoin,
      targetCoin
    )

    // We do not supported FROM trading TO user key
    const isFromCustodial = formValues?.source?.type === 'CUSTODIAL'

    const fromElements = generateActiveGroups(availableSourceCoins)
    const toElements = generateActiveGroups(availableTargetCoins).map(group => {
      return isFromCustodial
        ? {
            ...group,
            options: group.options.filter(
              value => value.value.type === 'CUSTODIAL'
            )
          }
        : group
    })

    return {
      fromElements,
      toElements,
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
