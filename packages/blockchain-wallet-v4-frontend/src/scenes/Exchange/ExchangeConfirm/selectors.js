import { selectors, model } from 'data'
import { lift, path } from 'ramda'

const { EXCHANGE_FORM, formatPair } = model.components.exchange
const { getAmounts, getRates } = selectors.components.exchange

export const getData = state => {
  const currencyR = selectors.core.settings.getCurrency(state)
  const formValues = selectors.form.getFormValues(EXCHANGE_FORM, state)
  const sourceCoin = path(['source', 'coin'], formValues) || 'BTC'
  const targetCoin = path(['target', 'coin'], formValues) || 'ETH'
  const pair = formatPair(sourceCoin, targetCoin)
  const amountsR = getAmounts(state, pair)
  const ratesR = getRates(state, pair)

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
