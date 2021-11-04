import { RootState } from 'data/rootReducer'

export const getNftAssets = (state: RootState) => state.components.nfts.assets
export const getNftOrders = (state: RootState) => state.components.nfts.orders
export const getMarketplace = (state: RootState) => state.components.nfts.marketplace
