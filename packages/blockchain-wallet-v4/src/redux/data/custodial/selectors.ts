import { RootState } from 'data/rootReducer'

export const getNextSBTransactionsURL = (state: RootState, currency: string) => {
  return state.dataPath.custodial.coins[currency]?.nextSBTransactionsURL || null
}

export const getSBTransactionsPending = (state: RootState, currency: string) => {
  return state.dataPath.custodial.coins[currency]?.pendingTxsN || 0
}

export const getTotalSBTransactionsPendingN = (state: RootState) => {
  let n = 0
  Object.keys(state.dataPath.custodial).map((coin) => {
    n += state.dataPath.custodial.coins[coin]?.pendingTxsN || 0
    return n
  })
  return n
}
