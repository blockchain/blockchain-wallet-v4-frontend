import * as bowser from 'bowser'
import { selectors, model } from 'data'
import { equals, lift, path, prop } from 'ramda'
import { createDeepEqualSelector } from 'services/ReselectHelper'
import { currencySymbolMap } from 'services/CoinifyService'
import { Remote } from 'blockchain-wallet-v4'
import { ADDRESS_TYPES } from 'blockchain-wallet-v4/src/redux/payment/btc/utils'

const { EXCHANGE_FORM } = model.components.exchange
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

const {
  canUseExchange,
  getAvailablePairs,
  getMax,
  getMin,
  getTxError,
  showError
} = selectors.components.exchange

export { canUseExchange, getMin, getMax, showError, getTxError }
export const getData = createDeepEqualSelector(
  [
    getBlockLockbox,
    selectors.core.settings.getCurrency,
    getFormValues,
    getAvailablePairs,
    getCurrentPairAmounts,
    canUseExchange
  ],
  (
    blockLockbox,
    currencyR,
    formValues,
    availablePairsR,
    adviceAmountsR,
    canUseExchange
  ) => {
    if (!canUseExchange) return Remote.Loading

    const { fix, sourceCoin, targetCoin, volume } = formValues

    const transform = (currency, availablePairs) => {
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
        inputField,
        inputSymbol: currencySymbolMap[inputCurrency],
        sourceActive: sourceActive(fix),
        sourceAmount: amountsR.map(prop('sourceAmount')),
        sourceCoin,
        targetActive: targetActive(fix),
        targetAmount: amountsR.map(prop('targetAmount')),
        targetCoin,
        targetFiat: amountsR.map(prop('targetFiat')),
        volume
      }
    }
    return lift(transform)(currencyR, availablePairsR)
  }
)
