import { selectors, model } from 'data'
import { lift, path } from 'ramda'
import { Exchange } from 'blockchain-wallet-v4/src'

const { formatPair } = model.rates
const { EXCHANGE_FORM } = model.components.exchange
const { getAmounts } = selectors.components.exchange

export const getData = state => {
  const currencyR = selectors.core.settings.getCurrency(state)
  const formValues = selectors.form.getFormValues(EXCHANGE_FORM)(state)
  const sourceCoin = path(['source', 'coin'], formValues) || 'BTC'
  const targetCoin = path(['target', 'coin'], formValues) || 'ETH'
  const pair = formatPair(sourceCoin, targetCoin)
  const amountsR = getAmounts(pair, state)

  const transform = (currency, amounts) => ({
    fiatCurrencySymbol: Exchange.getSymbol(currency),
    sourceAmount: amounts.sourceAmount,
    targetAmount: amounts.targetAmount,
    targetFiat: amounts.targetFiat,
    sourceCoin,
    targetCoin,
    currency
  })

  return lift(transform)(currencyR, amountsR)
}
