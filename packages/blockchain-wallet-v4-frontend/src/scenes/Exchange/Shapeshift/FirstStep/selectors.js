import { selectors } from 'data'
import { lift, prop } from 'ramda'
import { formValueSelector } from 'redux-form'

export const getData = state => {
  const firstStepR = selectors.components.exchange.getFirstStep(state)
  const currencyR = selectors.core.settings.getCurrency(state)
  const enabled = selectors.components.exchange.getFirstStepEnabled(state)
  const formError = selectors.components.exchange.getError(state)
  const source = formValueSelector('exchange')(state, 'source')
  const target = formValueSelector('exchange')(state, 'target')
  const sourceCoin = prop('coin', source)
  const targetCoin = prop('coin', target)

  const transform = (firstStep, currency) => ({
    accounts: prop('accounts', firstStep),
    enabled,
    formError,
    currency,
    sourceCoin,
    targetCoin
  })

  return lift(transform)(firstStepR, currencyR)
}
