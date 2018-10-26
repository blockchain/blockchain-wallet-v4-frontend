import * as bowser from 'bowser'
import { selectors, model } from 'data'
import {
  always,
  compose,
  curry,
  equals,
  flip,
  lift,
  map,
  path,
  prop,
  unnest
} from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { currencySymbolMap } from 'services/CoinifyService'
import { Remote } from 'blockchain-wallet-v4'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'

const {
  EXCHANGE_FORM,
  getAvailableSourceCoins,
  getAvailableTargetCoins
} = model.components.exchange
const {
  getComplementaryField,
  mapFixToFieldName,
  formatPair,
  FIX_TYPES,
  coinActive,
  fiatActive,
  sourceActive,
  targetActive
} = model.rates
const { BASE_IN_FIAT } = FIX_TYPES

const getCoinFullName = flip(prop)({
  BTC: 'Bitcoin',
  BCH: 'Bitcoin Cash',
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

export const generateGroups = curry((accounts, availableCurrencies) => {
  const items = compose(
    unnest,
    map(generateItems),
    map(coin => ({ coin, accounts: prop(coin, accounts) }))
  )(availableCurrencies)
  return [{ group: '', items }]
})

const getFormValues = state => {
  const formValues = selectors.form.getFormValues(EXCHANGE_FORM)(state)
  const fix = prop('fix', formValues) || BASE_IN_FIAT
  return {
    sourceCoin: path(['source', 'coin'], formValues) || 'BTC',
    targetCoin: path(['target', 'coin'], formValues) || 'ETH',
    fix,
    volume: prop(mapFixToFieldName(fix), formValues)
  }
}

const getBlockLockbox = state => {
  const formValues = selectors.form.getFormValues(EXCHANGE_FORM)(state)
  return (
    equals(path(['source', 'type'], formValues), ADDRESS_TYPES.LOCKBOX) &&
    !(bowser.name === 'Chrome' || bowser.name === 'Chromium')
  )
}

const getCurrentPair = state => {
  const { sourceCoin, targetCoin } = getFormValues(state)
  return formatPair(sourceCoin, targetCoin)
}

const getCurrentPairAmounts = state =>
  selectors.components.exchange.getAmounts(getCurrentPair(state), state)

const getCurrentPairRates = state =>
  selectors.components.exchange.getRates(getCurrentPair(state), state)

const fallbackToNullAmounts = adviceAmountsR =>
  adviceAmountsR.cata({
    Success: () => adviceAmountsR,
    Failure: () => Remote.of(nullAmounts),
    Loading: () => adviceAmountsR,
    NotAsked: () => Remote.of(nullAmounts)
  })

const nullAmounts = {
  sourceAmount: 0,
  targetAmount: 0,
  sourceFiat: 0,
  targetFiat: 0
}

const fallbackToBestRates = (adviceRatesR, bestRatesR) =>
  adviceRatesR.cata({
    Success: () => adviceRatesR,
    Failure: () => bestRatesR,
    Loading: () => adviceRatesR,
    NotAsked: () => bestRatesR
  })

const formatBestRates = curry(
  (sourceCoin, targetCoin, currency, bestRates) => ({
    sourceToTargetRate: path(
      [formatPair(sourceCoin, targetCoin), 'price'],
      bestRates
    ),
    sourceToFiatRate: path(
      [formatPair(sourceCoin, currency), 'price'],
      bestRates
    ),
    targetToFiatRate: path(
      [formatPair(targetCoin, currency), 'price'],
      bestRates
    )
  })
)

const {
  canUseExchange,
  getActiveAccounts,
  getMin,
  getMax,
  getTargetFee,
  getSourceFee,
  showError,
  getTxError
} = selectors.components.exchange

export {
  canUseExchange,
  getMin,
  getMax,
  getTargetFee,
  getSourceFee,
  showError,
  getTxError
}
export const getData = createDeepEqualSelector(
  [
    getActiveAccounts,
    getBlockLockbox,
    selectors.core.settings.getCurrency,
    getFormValues,
    selectors.modules.rates.getAvailablePairs,
    getCurrentPairAmounts,
    getCurrentPairRates,
    selectors.modules.rates.getBestRates,
    canUseExchange
  ],
  (
    accounts,
    blockLockbox,
    currencyR,
    formValues,
    availablePairsR,
    adviceAmountsR,
    adviceRatesR,
    bestRatesR,
    canUseExchange
  ) => {
    if (!canUseExchange) return Remote.Loading

    const { fix, sourceCoin, targetCoin, volume } = formValues

    const transform = (currency, availablePairs) => {
      const availableSourceCoins = getAvailableSourceCoins(availablePairs)
      const availableTargetCoins = getAvailableTargetCoins(availablePairs)
      const generateActiveGroups = generateGroups(accounts)
      const fromElements = generateActiveGroups(availableSourceCoins)
      const toElements = generateActiveGroups(availableTargetCoins)

      const inputField = mapFixToFieldName(fix)
      const complementaryField = getComplementaryField(inputField)
      const fieldCoins = {
        sourceAmount: sourceCoin,
        sourceFiat: currency,
        targetAmount: targetCoin,
        targetFiat: currency
      }
      const inputCurrency = prop(inputField, fieldCoins)
      const amountsR = fallbackToNullAmounts(adviceAmountsR)
      const complementaryCurrency = prop(complementaryField, fieldCoins)
      const ratesR = fallbackToBestRates(
        adviceRatesR,
        bestRatesR.map(formatBestRates(sourceCoin, targetCoin, currency))
      )

      return {
        availablePairs,
        blockLockbox,
        canUseExchange: true,
        coinActive: coinActive(fix),
        complementaryAmount: amountsR.map(prop(complementaryField)),
        complementarySymbol: currencySymbolMap[complementaryCurrency],
        currency,
        disabled: !Remote.Success.is(amountsR),
        fiatActive: fiatActive(fix),
        fix,
        fromElements,
        inputField,
        inputSymbol: currencySymbolMap[inputCurrency],
        sourceActive: sourceActive(fix),
        sourceAmount: amountsR.map(prop('sourceAmount')),
        sourceCoin,
        sourceToTargetRate: ratesR.map(prop('sourceToTargetRate')),
        sourceToFiatRate: ratesR.map(prop('sourceToFiatRate')),
        targetActive: targetActive(fix),
        targetAmount: amountsR.map(prop('targetAmount')),
        targetCoin,
        targetFiat: amountsR.map(prop('targetFiat')),
        targetToFiatRate: ratesR.map(prop('targetToFiatRate')),
        toElements,
        volume
      }
    }
    return lift(transform)(currencyR, availablePairsR)
  }
)
