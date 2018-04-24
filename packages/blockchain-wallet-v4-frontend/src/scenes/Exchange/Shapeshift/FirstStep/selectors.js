import { selectors } from 'data'
import { prop } from 'ramda'
import { Remote } from 'blockchain-wallet-v4/src'

export const getData = state => {
  const accounts = selectors.components.exchange.getAccounts(state)
  const payment = selectors.components.exchange.getPayment(state)
  const firstStepEnabled = selectors.components.exchange.getFirstStepEnabled(state)

  return Remote.of({
    effectiveBalance: prop('effectiveBalance', payment),
    accounts,
    enabled: firstStepEnabled
  })
}
