import { RootState } from 'data/rootReducer'

export const getNextBSTransactionsURL = (state: RootState, currency: string) => {
  return state.dataPath.custodial.coins[currency]?.nextBSTransactionsURL || null
}

export const getBSTransactionsPending = (state: RootState, currency: string) => {
  return state.dataPath.custodial.coins[currency]?.pendingTxsN || 0
}

export const getTotalBSTransactionsPendingN = (state: RootState) => {
  return Object.keys(state.dataPath.custodial).reduce((acc, currency) => {
    acc += getBSTransactionsPending(state, currency)
    return acc
  }, 0)
}
