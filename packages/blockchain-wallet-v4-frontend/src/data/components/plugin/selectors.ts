import { RootState } from 'data/rootReducer'

export const getPublicAddress = (state: RootState) => state.components.plugin.publicAddress
