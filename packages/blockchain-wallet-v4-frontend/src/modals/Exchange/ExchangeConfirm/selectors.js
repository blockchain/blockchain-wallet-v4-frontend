import { selectors, model } from 'data'
import { lift, path } from 'ramda'

const { formatPair } = model.rates
const { EXCHANGE_FORM } = model.components.exchange
const { getAmounts } = selectors.components.exchange

export const getData = state => {
  const currencyR = selectors.core.settings.getCurrency(state)
  const formValues = selectors.form.getFormValues(EXCHANGE_FORM)(state)
  const sourceCoin = path(['source', 'coin'], formValues) || 'BTC'
  const targetCoin = path(['target', 'coin'], formValues) || 'ETH'
  const sourceCoinModelR = selectors.core.walletOptions.getCoinModel(
    state,
    sourceCoin
  )
  const targetCoinModelR = selectors.core.walletOptions.getCoinModel(
    state,
    targetCoin
  )
  const pair = formatPair(sourceCoin, targetCoin)
  const amountsR = getAmounts(pair, state)

  const transform = (currency, amounts, sourceCoinModel, targetCoinModel) => ({
    currency,
    sourceAmount: amounts.sourceAmount,
    sourceCoin,
    sourceCoinIcon: path(['icons', 'circleFilled'], sourceCoinModel),
    targetAmount: amounts.targetAmount,
    targetCoin,
    targetCoinIcon: path(['icons', 'circleFilled'], targetCoinModel)
  })

  return lift(transform)(
    currencyR,
    amountsR,
    sourceCoinModelR,
    targetCoinModelR
  )
}
