import { FiatType } from 'core/types'
import { RootState } from 'data/rootReducer'

export const getFiatData = (currency: FiatType, state: RootState) => {
  return state.dataPath.fiat[currency]
}

export const getTransactions = (currency: FiatType, state: RootState) => {
  return state.dataPath.fiat[currency]?.transactions || []
}
