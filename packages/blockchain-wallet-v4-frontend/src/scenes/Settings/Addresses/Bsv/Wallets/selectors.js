import { lift, map } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const formatAccounts = map(x => ({ label: x.label, value: x }))
  const accounts = selectors.core.kvStore.bsv.getAccounts(state)
  const defaultIndex = selectors.core.kvStore.bsv.getDefaultAccountIndex(state)
  const wallets = selectors.core.common.bsv
    .getAccountsBalances(state)
    .map(formatAccounts)

  const combine = (accounts, wallets, defaultIndex) => {
    return {
      accounts,
      wallets,
      defaultIndex
    }
  }

  return lift(combine)(accounts, wallets, defaultIndex)
}
