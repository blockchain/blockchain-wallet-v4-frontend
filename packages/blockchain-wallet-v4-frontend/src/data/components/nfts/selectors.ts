import { RootState } from 'data/rootReducer'

export const getAcceptOffer = (state: RootState) => state.components.nfts.acceptOffer
export const getNftActiveTab = (state: RootState) => state.components.nfts.activeTab
export const getNftAssets = (state: RootState) => state.components.nfts.assets
export const getCollectionSearch = (state: RootState) => state.components.nfts.collectionSearch
export const getNftCollections = (state: RootState) => state.components.nfts.collections
export const getMarketplace = (state: RootState) => state.components.nfts.marketplace
export const getOffersForAsset = (state: RootState) => state.components.nfts.offersForAsset
export const getOffersMade = (state: RootState) => state.components.nfts.offersMade
export const getOrderFlow = (state: RootState) => state.components.nfts.orderFlow
export const getCancelListing = (state: RootState) => state.components.nfts.cancelListing
export const getSellOrder = (state: RootState) => state.components.nfts.sellOrder
export const getTransfer = (state: RootState) => state.components.nfts.transfer
