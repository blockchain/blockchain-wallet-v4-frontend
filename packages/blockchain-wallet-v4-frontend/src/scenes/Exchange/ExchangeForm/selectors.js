import { selectors, model } from 'data'
import {
  append,
  compose,
  cond,
  curry,
  equals,
  filter,
  flip,
  head,
  indexOf,
  last,
  length,
  lift,
  map,
  path,
  prop,
  sortBy,
  unnest
} from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { currencySymbolMap } from 'services/CoinifyService'
import { Remote } from 'blockchain-wallet-v4'

const { EXCHANGE_FORM } = model.components.exchange
const {
  getComplementaryField,
  mapFixToFieldName,
  formatPair,
  splitPair,
  FIX_TYPES,
  coinActive,
  fiatActive,
  sourceActive,
  targetActive
} = model.rates
const { BASE_IN_FIAT } = FIX_TYPES

const currenciesOrder = ['BTC', 'BCH', 'ETH']

const getPairedCurrencies = curry(
  (
    getComparedCurrency,
    getResultingCurrency,
    targetCurrency,
    availableCurrencies
  ) =>
    compose(
      sortBy(flip(indexOf)(currenciesOrder)),
      append(targetCurrency),
      map(getResultingCurrency),
      filter(pair => getComparedCurrency(pair) === targetCurrency),
      map(splitPair)
    )(availableCurrencies)
)

const getFromCurrencies = getPairedCurrencies(last, head)
const getToCurrencies = getPairedCurrencies(head, last)

export const format = acc => ({ text: prop('label', acc), value: acc })
export const formatDefault = curry((coin, acc) => ({ text: coin, value: acc }))

export const generateGroups = (
  bchAccounts,
  btcAccounts,
  ethAccounts,
  hasOneAccount
) => availableCurrencies => {
  const getOneAccElements = cond([
    [equals('BTC'), () => btcAccounts.map(formatDefault('Bitcoin'))],
    [equals('BCH'), () => bchAccounts.map(formatDefault('Bitcoin Cash'))],
    [equals('ETH'), () => ethAccounts.map(formatDefault('Ether'))]
  ])
  const getAccElements = cond([
    [equals('BTC'), () => btcAccounts.map(format)],
    [equals('BCH'), () => bchAccounts.map(format)],
    [equals('ETH'), () => ethAccounts.map(format)]
  ])
  const items = compose(
    unnest,
    map(hasOneAccount ? getOneAccElements : getAccElements)
  )(availableCurrencies)
  return [{ group: '', items }]
}

const getFormValues = state => {
  const formValues = selectors.form.getFormValues(EXCHANGE_FORM)(state)
  return {
    sourceCoin: path(['source', 'coin'], formValues) || 'BTC',
    targetCoin: path(['target', 'coin'], formValues) || 'ETH',
    fix: prop('fix', formValues) || BASE_IN_FIAT
  }
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
  getError,
  getActiveBtcAccounts,
  getActiveBchAccounts,
  getActiveEthAccounts,
  getMin,
  getMax
} = selectors.components.exchange

export { canUseExchange, getMin, getMax }
export const getData = createDeepEqualSelector(
  [
    getActiveBtcAccounts,
    getActiveBchAccounts,
    getActiveEthAccounts,
    selectors.core.settings.getCurrency,
    getError,
    getFormValues,
    selectors.modules.rates.getAvailablePairs,
    getCurrentPairAmounts,
    getCurrentPairRates,
    selectors.modules.rates.getBestRates,
    canUseExchange
  ],
  (
    btcAccountsR,
    bchAccountsR,
    ethAccountsR,
    currencyR,
    formError,
    formValues,
    availablePairsR,
    adviceAmountsR,
    adviceRatesR,
    bestRatesR,
    canUseExchange
  ) => {
    if (!canUseExchange) return Remote.Loading

    const activeBtcAccounts = btcAccountsR.getOrElse([])
    const activeBchAccounts = bchAccountsR.getOrElse([])
    const activeEthAccounts = ethAccountsR.getOrElse([])
    const { sourceCoin, targetCoin, fix } = formValues

    const transform = (currency, availablePairs) => {
      const defaultBtcAccount = head(activeBtcAccounts)
      const defaultEthAccount = head(activeEthAccounts)
      const hasOneAccount = length(activeBtcAccounts) === 1
      const generateActiveGroups = generateGroups(
        activeBchAccounts,
        activeBtcAccounts,
        activeEthAccounts,
        hasOneAccount
      )
      const fromElements = generateActiveGroups(
        getFromCurrencies(targetCoin, availablePairs)
      )
      const toElements = generateActiveGroups(
        getToCurrencies(sourceCoin, availablePairs)
      )

      const initialValues = {
        source: defaultBtcAccount,
        target: defaultEthAccount,
        sourceFiat: 0,
        fix: BASE_IN_FIAT
      }
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
        canUseExchange: true,
        availablePairs,
        fromElements,
        toElements,
        initialValues,
        hasOneAccount,
        disabled: !Remote.Success.is(amountsR),
        formError,
        currency,
        inputField,
        inputSymbol: currencySymbolMap[inputCurrency],
        complementaryAmount: amountsR.map(prop(complementaryField)),
        complementarySymbol: currencySymbolMap[complementaryCurrency],
        sourceAmount: amountsR.map(prop('sourceAmount')),
        targetAmount: amountsR.map(prop('targetAmount')),
        targetFiat: amountsR.map(prop('targetFiat')),
        sourceToTargetRate: ratesR.map(prop('sourceToTargetRate')),
        sourceToFiatRate: ratesR.map(prop('sourceToFiatRate')),
        targetToFiatRate: ratesR.map(prop('targetToFiatRate')),
        sourceCoin,
        targetCoin,
        sourceActive: sourceActive(fix),
        targetActive: targetActive(fix),
        coinActive: coinActive(fix),
        fiatActive: fiatActive(fix),
        fix
      }
    }
    return lift(transform)(currencyR, availablePairsR)
  }
)
