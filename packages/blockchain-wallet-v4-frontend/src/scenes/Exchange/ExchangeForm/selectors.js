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

const { getAmounts, getAvailablePairs } = selectors.components.exchange

export const getData = createDeepEqualSelector(
  [
    getBlockLockbox,
    selectors.core.settings.getCurrency,
    getFormValues,
    getAvailablePairs
  ],
  (blockLockbox, currencyR, formValues, availablePairsR) => {
    const { fix, sourceCoin, targetCoin, volume } = formValues

    const transform = (currency, availablePairs) => {
      const inputField = mapFixToFieldName(fix)
      const fieldCoins = {
        sourceAmount: sourceCoin,
        sourceFiat: currency,
        targetAmount: targetCoin,
        targetFiat: currency
      }
      const inputCurrency = prop(inputField, fieldCoins)
      const complementaryField = getComplementaryField(inputField)
      const complementaryCurrency = prop(complementaryField, fieldCoins)

      return {
        availablePairs,
        blockLockbox,
        coinActive: coinActive(fix),
        complementaryField,
        complementarySymbol: currencySymbolMap[complementaryCurrency],
        currency,
        fiatActive: fiatActive(fix),
        fix,
        inputField,
        inputSymbol: currencySymbolMap[inputCurrency],
        sourceActive: sourceActive(fix),
        sourceCoin,
        targetActive: targetActive(fix),
        targetCoin,
        volume
      }
    }
    return lift(transform)(currencyR, availablePairsR)
  }
)

const nullAmounts = {
  sourceAmount: 0,
  targetAmount: 0,
  sourceFiat: 0,
  targetFiat: 0
}

const fallbackToNullAmounts = adviceAmountsR =>
  adviceAmountsR.cata({
    Success: () => adviceAmountsR,
    Failure: () => Remote.of(nullAmounts),
    Loading: () => adviceAmountsR,
    NotAsked: () => Remote.of(nullAmounts)
  })

export const getCurrentPairAmounts = createDeepEqualSelector(
  (state, { sourceCoin, targetCoin }) =>
    getAmounts(formatPair(sourceCoin, targetCoin), state),
  amountsR => fallbackToNullAmounts(amountsR)
)
