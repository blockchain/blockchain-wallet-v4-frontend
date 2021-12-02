import { RootState } from 'data/rootReducer'

import { InitWalletConnectPayload } from './types'

export const getAuthorizedDappsList = (): Array<InitWalletConnectPayload> => {
  const authorizedDappsList: Array<InitWalletConnectPayload> = []

  for (let i = 0; i < localStorage.length; i += 1) {
    const localStorageKey = localStorage.key(i)

    if (localStorageKey && localStorageKey.startsWith('wc:')) {
      const localStorageValue = localStorage.getItem(localStorageKey)
      if (localStorageValue) {
        authorizedDappsList.push({
          sessionDetails: JSON.parse(localStorageValue),
          uri: localStorageKey
        })
      }
    }
  }

  return authorizedDappsList
}

export const getSessionDetails = (state: RootState) => state.components.walletConnect.sessionDetails
export const getStep = (state: RootState) => state.components.walletConnect.step
export const getUri = (state: RootState) => state.components.walletConnect.uri
