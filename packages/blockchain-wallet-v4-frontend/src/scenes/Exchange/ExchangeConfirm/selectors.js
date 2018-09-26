import { selectors, model } from 'data'
import { lift, path, prop } from 'ramda'

const { formatPair, sourceActive } = model.rates
const { EXCHANGE_FORM } = model.components.exchange
const { getAmounts, getRates, getSourceFee } = selectors.components.exchange

export const getData = state => {
  const currencyR = selectors.core.settings.getCurrency(state)
  const formValues = selectors.form.getFormValues(EXCHANGE_FORM)(state)
  const fix = prop('fix', formValues)
  const sourceCoin = path(['source', 'coin'], formValues) || 'BTC'
  const targetCoin = path(['target', 'coin'], formValues) || 'ETH'
  const pair = formatPair(sourceCoin, targetCoin)
  const amountsR = getAmounts(pair, state)
  const ratesR = getRates(pair, state)
  const sourceFee = getSourceFee(state)

  const transform = (currency, amounts, rates) => ({
    sourceAmount: amounts.sourceAmount,
    targetAmount: amounts.targetAmount,
    sourceFiat: amounts.sourceFiat,
    targetFiat: amounts.targetFiat,
    sourceToTargetRate: rates.sourceToTargetRate,
    sourceCoin,
    targetCoin,
    sourceFee,
    sourceActive: sourceActive(fix),
    currency
  })

  return lift(transform)(currencyR, amountsR, ratesR)
}
