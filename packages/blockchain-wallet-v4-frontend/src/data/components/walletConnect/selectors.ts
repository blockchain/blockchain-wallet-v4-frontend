import { RootState } from 'data/rootReducer'

export const getSessionDetails = (state: RootState) => state.components.walletConnect.sessionDetails
export const getStep = (state: RootState) => state.components.walletConnect.step
export const getUri = (state: RootState) => state.components.walletConnect.uri
