import { WalletFiatType } from 'core/types'
import { RootState } from 'data/rootReducer'

export const getFiatData = (currency: WalletFiatType, state: RootState) => {
  return state.dataPath.fiat[currency]
}

export const getTransactions = (currency: WalletFiatType, state: RootState) => {
  return state.dataPath.fiat[currency]?.page || []
}
