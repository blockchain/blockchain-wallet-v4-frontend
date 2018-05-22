import { lift } from 'ramda'

import { selectors } from 'data'

export const getData = (state) => {
  const bankAccounts = selectors.core.data.coinify.getBankAccounts(state)
  return lift(b => ({ bankAccounts: b }))(bankAccounts)
}
