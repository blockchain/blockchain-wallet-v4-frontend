import { RootState } from 'data/rootReducer'

export const getActiveSlug = (state: RootState) => state.components.nfts.activeSlug
export const getNftCollection = (state: RootState) => state.components.nfts.collection
export const getNftSearch = (state: RootState) => state.components.nfts.search
export const getOpenSeaAsset = (state: RootState) => state.components.nfts.openSeaAsset
export const getOpenSeaStatus = (state: RootState) => state.components.nfts.openSeaStatus
export const getOrderFlow = (state: RootState) => state.components.nfts.orderFlow
