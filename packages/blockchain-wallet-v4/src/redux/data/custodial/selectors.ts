import { WalletCurrencyType } from 'core/types'
import { RootState } from 'data/rootReducer'

export const getNextSBTransactionsURL = (
  state: RootState,
  currency: WalletCurrencyType
) => {
  return state.dataPath.custodial[currency].nextSBTransactionsURL
}

export const getSBTransactionsPending = (
  state: RootState,
  currency: WalletCurrencyType
) => {
  return state.dataPath.custodial[currency].pendingTxsN
}

export const getTotalSBTransactionsPendingN = (state: RootState) => {
  let n = 0
  Object.keys(state.dataPath.custodial).map(
    coin => (n += state.dataPath.custodial[coin].pendingTxsN)
  )
  return n
}
