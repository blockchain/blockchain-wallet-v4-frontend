import { RootState } from 'data/rootReducer'

export const getNftAssets = (state: RootState) => state.components.nfts.assets
export const getMarketplace = (state: RootState) => state.components.nfts.marketplace
export const getOrderFlow = (state: RootState) => state.components.nfts.orderFlow
export const getCancelListing = (state: RootState) => state.components.nfts.cancelListing
