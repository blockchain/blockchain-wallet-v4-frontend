import { selectors } from 'data'
import { formValueSelector } from 'redux-form'

const getFormValues = formValueSelector('sfoxLink')

export const getData = state => {
  const bankAccounts = selectors.core.data.sfox.getBankAccounts(state)
  const accounts = selectors.core.data.sfox.getAccounts(state)
  const busyStatus = selectors.modules.sfox.getSfoxBusy(state)
  const deposit1 = getFormValues(state, 'deposit1')
  const deposit2 = getFormValues(state, 'deposit2')
  const accountHolderFirst = getFormValues(state, 'accountHolderFirst')
  const accountHolderLast = getFormValues(state, 'accountHolderLast')

  const plaidKey = selectors.core.walletOptions.getPlaidKey(state).getOrElse()
  const plaidEnv = selectors.core.walletOptions.getPlaidEnv(state).getOrElse()
  const plaidBaseUrl = selectors.core.walletOptions
    .getWalletHelperUrl(state)
    .getOrElse('https://wallet-helper.blockchain.info') // fallback to production

  return {
    bankAccounts,
    accounts,
    deposit1,
    deposit2,
    accountHolderFirst,
    accountHolderLast,
    busyStatus,
    plaidKey,
    plaidEnv,
    plaidBaseUrl
  }
}
