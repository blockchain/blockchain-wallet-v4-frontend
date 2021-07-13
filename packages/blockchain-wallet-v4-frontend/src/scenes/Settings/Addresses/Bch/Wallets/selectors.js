import { lift, map } from 'ramda'

import { selectors } from 'data'

export const getData = state => {
  const formatAccounts = map(x => ({ label: x.label, value: x }))
  const bchAccounts = selectors.core.kvStore.bch.getAccounts(state)
  const defaultIndex = selectors.core.kvStore.bch.getDefaultAccountIndex(state)
  const wallets = selectors.core.common.bch
    .getAccountsBalances(state)
    .map(formatAccounts)

  const combine = (bchAccounts, wallets, defaultIndex) => ({
    bchAccounts,
    wallets,
    defaultIndex
  })

  return lift(combine)(bchAccounts, wallets, defaultIndex)
}
