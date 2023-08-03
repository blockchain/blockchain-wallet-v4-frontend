import { WalletOptionsType } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

export const getActiveSlug = (state: RootState) => state.components.nfts.activeSlug
export const getNftCollection = (state: RootState) => state.components.nfts.collection
export const getNftSearch = (state: RootState) => state.components.nfts.search
export const getNftUserPreferences = (state: RootState) => state.components.nfts.userPreferences
export const getOpenSeaAsset = (state: RootState) => state.components.nfts.openSeaAsset
export const getOpenSeaStatus = (state: RootState) => state.components.nfts.openSeaStatus
export const getNftOwnerAssets = (state: RootState) => state.components.nfts.nftOwnerAssets
export const getOrderFlow = (state: RootState) => state.components.nfts.orderFlow

export const getIsTestnet = (state: RootState) =>
  selectors.core.walletOptions
    .getDomains(state)
    .getOrElse({ opensea: 'https://api.opensea.io' } as WalletOptionsType['domains'])
    .opensea?.includes('testnets')
