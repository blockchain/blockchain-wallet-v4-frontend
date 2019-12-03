import { lift, path } from 'ramda'
import { model, selectors } from 'data'

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
    sourceCoinModel,
    targetAmount: amounts.targetAmount,
    targetCoinModel
  })

  return lift(transform)(
    currencyR,
    amountsR,
    sourceCoinModelR,
    targetCoinModelR
  )
}
