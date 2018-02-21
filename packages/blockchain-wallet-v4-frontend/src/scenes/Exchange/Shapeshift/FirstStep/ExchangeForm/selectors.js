import { path } from 'ramda'
import { formValueSelector } from 'redux-form'

export const getData = state => {
  const accounts = formValueSelector('exchange')(state, 'accounts')
  const amount = formValueSelector('exchange')(state, 'amount')
  const coinSource = path(['source', 'coin'], accounts)
  const coinTarget = path(['target', 'coin'], accounts)

  return {
    accounts,
    amount,
    coinSource,
    coinTarget
  }
}
