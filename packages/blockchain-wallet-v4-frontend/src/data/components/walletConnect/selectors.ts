import { RootState } from 'data/rootReducer'

import { WC_STORAGE_KEY } from './model'

// TODO: types!
export const getAuthorizedDappsList = (): Array<any> => {
  const dappListString = localStorage.getItem(WC_STORAGE_KEY)
  return dappListString ? JSON.parse(dappListString) : []
}
export const getSessionDetails = (state: RootState) => state.components.walletConnect.sessionDetails
export const getStep = (state: RootState) => state.components.walletConnect.step
export const getUri = (state: RootState) => state.components.walletConnect.uri
