import { selectors, model } from 'data'
import {
  concat,
  cond,
  compose,
  curry,
  defaultTo,
  equals,
  head,
  last,
  length,
  lift,
  map,
  mergeWith,
  path,
  prop,
  unnest,
  uniq
} from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { currencySymbolMap } from 'services/CoinifyService'
import { Remote } from 'blockchain-wallet-v4'

const {
  EXCHANGE_FORM,
  getTargetCoinsPairedToSource,
  sortByOrder
} = model.components.exchange
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

const getAvailableCoin = headOrLast => availablePairs =>
  compose(
    sortByOrder,
    uniq,
    map(headOrLast),
    map(splitPair)
  )(availablePairs)
const getAvailableSourceCoins = getAvailableCoin(head)
const getAvailableTargetCoins = getAvailableCoin(last)

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
  getActiveBtcAccounts,
  getActiveBchAccounts,
  getActiveEthAccounts,
  getMin,
  getMax,
  getTargetFee,
  getSourceFee
} = selectors.components.exchange

export { canUseExchange, getMin, getMax, getTargetFee, getSourceFee }
export const getData = createDeepEqualSelector(
  [
    getActiveBtcAccounts,
    getActiveBchAccounts,
    getActiveEthAccounts,
    selectors.core.common.btc.getLockboxBtcBalances,
    selectors.core.common.bch.getLockboxBchBalances,
    selectors.core.common.eth.getLockboxEthBalances,
    selectors.core.settings.getCurrency,
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
    lockboxBtcAccountsR,
    lockboxBchAccountsR,
    lockboxEthAccountsR,
    currencyR,
    formValues,
    availablePairsR,
    adviceAmountsR,
    adviceRatesR,
    bestRatesR,
    canUseExchange
  ) => {
    if (!canUseExchange) return Remote.Loading
    const accounts = mergeWith(
      concat,
      {
        BTC: btcAccountsR.getOrElse([]),
        BCH: bchAccountsR.getOrElse([]),
        ETH: ethAccountsR.getOrElse([])
      },
      {
        BTC: lockboxBtcAccountsR.getOrElse([]),
        BCH: lockboxBchAccountsR.getOrElse([]),
        ETH: lockboxEthAccountsR.getOrElse([])
      }
    )
    const { fix, sourceCoin, targetCoin } = formValues

    const transform = (currency, availablePairs) => {
      const availableSourceCoins = getAvailableSourceCoins(availablePairs)
      const availableTargetCoins = getAvailableTargetCoins(availablePairs)
      const initialSourceCoin = defaultTo(
        sourceCoin,
        head(availableSourceCoins)
      )
      const initialTargetCoin = compose(
        defaultTo(targetCoin),
        last,
        getTargetCoinsPairedToSource
      )(initialSourceCoin, availablePairs)
      const initialSourceAccount = head(accounts[initialSourceCoin])
      const initialTargetAccount = head(accounts[initialTargetCoin])
      const hasOneAccount = length(accounts.BTC) === 1
      const generateActiveGroups = generateGroups(
        accounts.BCH,
        accounts.BTC,
        accounts.ETH,
        hasOneAccount
      )
      const fromElements = generateActiveGroups(availableSourceCoins)
      const toElements = generateActiveGroups(availableTargetCoins)

      const initialValues = {
        source: initialSourceAccount,
        target: initialTargetAccount,
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
