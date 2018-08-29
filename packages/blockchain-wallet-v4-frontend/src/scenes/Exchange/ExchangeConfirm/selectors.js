import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors, model } from 'data'
import { lift, path } from 'ramda'

const { EXCHANGE_FORM, formatPair } = model.components.exchange

export const getData = createDeepEqualSelector(
  [
    selectors.form.getFormValues(EXCHANGE_FORM),
    selectors.components.exchange.getAmounts,
    selectors.components.exchange.getRates,
    selectors.core.settings.getCurrency
  ],
  (formValues, getAmounts, getRates, currencyR) => {
    const sourceCoin = path(['source', 'coin'], formValues) || 'BTC'
    const targetCoin = path(['target', 'coin'], formValues) || 'ETH'
    const pair = formatPair(sourceCoin, targetCoin)
    const amountsR = getAmounts(pair)
    const ratesR = getRates(pair)

    const transform = (currency, amounts, rates) => ({
      sourceAmount: amounts.sourceAmount,
      targetAmount: amounts.targetAmount,
      targetFiat: amounts.targetFiat,
      sourceToTargetRate: rates.sourceToTargetRate,
      sourceCoin,
      targetCoin,
      currency
    })

    return lift(transform, currencyR, amountsR, ratesR)
  }
)
