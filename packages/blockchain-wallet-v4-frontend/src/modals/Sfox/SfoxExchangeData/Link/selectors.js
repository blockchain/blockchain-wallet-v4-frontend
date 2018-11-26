import { selectors } from 'data'
import { formValueSelector } from 'redux-form'
import { path } from 'ramda'

export const getData = state => {
  const bankAccounts = selectors.core.data.sfox.getBankAccounts(state)
  const accounts = selectors.core.data.sfox.getAccounts(state)
  const deposit1 = formValueSelector('sfoxLink')(state, 'deposit1')
  const deposit2 = formValueSelector('sfoxLink')(state, 'deposit2')
  const accountHolderFirst = formValueSelector('sfoxLink')(state, 'accountHolderFirst')
  const accountHolderLast = formValueSelector('sfoxLink')(state, 'accountHolderLast')

  const busyStatus = path(['sfoxSignup', 'sfoxBusy'], state)

  return {
    bankAccounts,
    accounts,
    deposit1,
    deposit2,
    accountHolderFirst,
    accountHolderLast,
    busyStatus
  }
}
