import { RootState } from 'data/rootReducer'
import { WalletCurrencyType } from 'core/types'

export const getNextSBTransactionsURL = (
  state: RootState,
  currency: WalletCurrencyType
) => {
  return state.dataPath.sbCore[currency].nextSBTransactionsURL
}

export const getSBTransactionsPending = (
  state: RootState,
  currency: WalletCurrencyType
) => {
  return state.dataPath.sbCore[currency].pendingTxsN
}

export const getTotalSBTransactionsPendingN = (state: RootState) => {
  let n = 0
  Object.keys(state.dataPath.sbCore).map(
    coin => (n += state.dataPath.sbCore[coin].pendingTxsN)
  )
  return n
}
