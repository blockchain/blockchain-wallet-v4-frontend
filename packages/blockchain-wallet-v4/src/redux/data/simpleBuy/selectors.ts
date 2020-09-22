import { RootState } from 'data/rootReducer'
import { WalletCurrencyType } from 'core/types'

export const getNextSBTransactionsURL = (
  state: RootState,
  currency: WalletCurrencyType
) => {
  return state.dataPath.sbCore[currency].nextSBTransactionsURL
}
