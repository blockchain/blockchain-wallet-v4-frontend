import { path } from 'ramda'
import { formValueSelector } from 'redux-form'

export const getData = state => {
  const accounts = formValueSelector('exchange')(state, 'accounts')
  const amount = formValueSelector('exchange')(state, 'amount')
  const sourceCoin = path(['source', 'coin'], accounts)
  const targetCoin = path(['target', 'coin'], accounts)

  return {
    accounts,
    amount,
    sourceCoin,
    targetCoin
  }
}
