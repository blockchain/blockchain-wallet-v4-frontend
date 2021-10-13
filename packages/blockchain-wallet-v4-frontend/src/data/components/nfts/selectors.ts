import { RootState } from 'data/rootReducer'

export const getNftAssets = (state: RootState) => state.components.nfts.assets
