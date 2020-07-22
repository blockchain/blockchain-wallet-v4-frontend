import { RootState } from 'data/rootReducer'
import { WalletFiatType } from 'core/types'

export const getFiatData = (currency: WalletFiatType, state: RootState) => {
  return state.dataPath.fiat[currency]
}

export const getTransactions = (currency: WalletFiatType, state: RootState) => {
  return state.dataPath.fiat[currency]?.transactions || []
}
