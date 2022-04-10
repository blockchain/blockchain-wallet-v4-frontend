import { RootState } from 'data/rootReducer'

export const getActiveSlug = (state: RootState) => state.components.nfts.activeSlug
export const getNftAssets = (state: RootState) => state.components.nfts.assets
export const getNftCollection = (state: RootState) => state.components.nfts.collection
export const getNftCollections = (state: RootState) => state.components.nfts.collections
export const getCollectionSearch = (state: RootState) => state.components.nfts.collectionSearch
export const getOffersMade = (state: RootState) => state.components.nfts.offersMade
export const getOpenSeaAsset = (state: RootState) => state.components.nfts.openSeaAsset
export const getOpenSeaStatus = (state: RootState) => state.components.nfts.openSeaStatus
export const getOrderFlow = (state: RootState) => state.components.nfts.orderFlow
