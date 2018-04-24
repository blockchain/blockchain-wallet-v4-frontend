import { selectors } from 'data'
import { prop } from 'ramda'
import { formValueSelector } from 'redux-form'
console.log('selectors', selectors)
export const getData = state => {
  const accounts = selectors.components.exchange.getAccounts(state)
  const enabled = selectors.components.exchange.getFirstStepEnabled(state)
  const minimum = selectors.components.exchange.getMinimum(state)
  const maximum = selectors.components.exchange.getMaximum(state)
  const formError = selectors.components.exchange.getError(state)
  const source = formValueSelector('exchange')(state, 'source')
  const target = formValueSelector('exchange')(state, 'target')
  const sourceCoin = prop('coin', source)
  const targetCoin = prop('coin', target)
  const currencyR = selectors.core.settings.getCurrency(state)

  const transform = (currency) => ({
    accounts,
    enabled,
    minimum,
    maximum,
    formError,
    currency,
    sourceCoin,
    targetCoin
  })

  return currencyR.map(transform)
}
