// NFTs Events
export enum Events {
  NFT_ACCEPT_OFFER_CLICKED = 'NFT Accept Offer Clicked',
  NFT_ACCEPT_OFFER_SUCCESS_FAIL = 'NFT Accept Offer Success/Fail',
  NFT_ACTIVITY_CANCEL_CLICKED = 'NFT Activity Cancel Clicked',
  NFT_ACTIVITY_CHART_ENGAGED = 'NFT Activity Chart Engaged',
  NFT_AMOUNT_ENTERED_SWITCHED = 'NFT Amount Entered Switched',
  NFT_ASSET_CLICKED = 'NFT Asset Clicked',
  NFT_ATTRIBUTES_CLICKED = 'NFT Attributes Clicked',
  NFT_BUY_NOW_CLICKED = 'NFT Buy Now Clicked',
  NFT_BUY_ON_OPENSEA_CLICKED = 'NFT Buy On Opensea Clicked',
  NFT_BUY_SUCCESS_FAIL = 'NFT Buy Success/Fail',
  NFT_CANCEL_LISTING_CLICKED = 'NFT Cancel Listing Clicked',
  NFT_CANCEL_LISTING_SUCCESS_FAIL = 'NFT Cancel Listing Success/Fail',
  NFT_CANCEL_OFFER_CLICKED = 'NFT Cancel Offer Clicked',
  NFT_CANCEL_OFFER_SUCCESS_FAIL = 'NFT Cancel Offer Success/Fail',
  NFT_CLOSE_AND_VIEW_ITEM_CLICKED = 'NFT Close And View Item Clicked',
  NFT_CONTRACT_ADDRESS_CLICKED = 'NFT Contract Address Clicked',
  NFT_ENTERED_AMOUNT = 'NFT Entered Amount',
  NFT_EXPLORER_CLICKED = 'NFT Explorer Clicked',
  NFT_FILTER_CLEAR_ALL_CLICKED = 'NFT Filter Clear All Clicked',
  NFT_FILTER_LISTING_TYPE = 'NFT Filter Listing Type',
  NFT_FILTER_PRICE_APPLIED = 'NFT Filter Price Applied',
  NFT_FILTER_REMOVED = 'NFT Filter Removed',
  NFT_GET_STARTED_CLICKED = 'NFT Get Started Clicked',
  NFT_GO_TO_PORTFOLIO_CLICKED = 'NFT Go To Portfolio Clicked',
  NFT_LEFT_MENU_CLOSED = 'NFT Left Menu Closed',
  NFT_LEFT_MENU_EXPANDED = 'NFT Left Menu Expanded',
  NFT_LISTING_SUCCESS_FAIL = 'NFT Listing Success/Fail',
  NFT_LOAD_MORE_CLICKED = 'NFT Load More Clicked',
  NFT_MAKE_AN_OFFER_CLICKED = 'NFT Make An Offer Clicked',
  NFT_MAKE_AN_OFFER_VIEWED = 'NFT Make An Offer Viewed',
  NFT_MAKE_OFFER_WITH_CLICKED = 'NFT Make Offer With Clicked',
  NFT_MARK_FOR_SALE = 'NFT Mark For Sale',
  NFT_MORE_CLICKED = 'NFT More Clicked',
  NFT_NFT_CLICKED = 'NFT NFT Clicked',
  NFT_OFFER_SUCCESS_FAIL = 'NFT Offer Success/Fail',
  NFT_OWNER_CLICKED = 'NFT Owner clicked',
  NFT_RECENTLY_LISTED_CLICKED = 'NFT Recently Listed Clicked',
  NFT_REFRESH_METADATA_CLICKED = 'NFT Refresh Metadata Clicked',
  NFT_RETURN_TO_MARKETPLACE_CLICKED = 'NFT Return To Marketplace Clicked',
  NFT_SELL_ITEM_CLICKED = 'NFT Sell Item Clicked',
  NFT_SELL_ITEM_SUCCESS_FAIL = 'NFT Sell Item Success/Fail',
  NFT_SEND_SUCCESS_FAIL = 'NFT Send Success/Fail',
  NFT_SHARE_CLICKED = 'NFT Share Clicked',
  NFT_TRANSFER_CLICKED = 'NFT Transfer Clicked',
  NFT_TRANSFER_SUCCESS_FAIL = 'NFT Transfer Success-Fail',
  NFT_VIEW_BUTTON_VIEWED = 'NFT View Button Viewed',
  NFT_VIEW_SUBMITTED_OFFER_CLICKED = 'NFT View Submitted Offer Clicked'
}

type TurnOffOn = 'TURN_OFF' | 'TURN_ON'

type SaleType = 'FIXED_PRICE' | 'TIME_AUCTION'

type Type = 'DROP-OFF' | 'FAILED' | 'SUCCESS'

type AcceptOfferClickedAction = {
  key: Events.NFT_ACCEPT_OFFER_CLICKED
  properties: {}
}

type AcceptOfferSuccessFailAction = {
  key: Events.NFT_ACCEPT_OFFER_SUCCESS_FAIL
  properties: {
    amount: number
    amount_usd: number
    currency: string
    error_message?: string
    type: Type
  }
}

type ActivityCancelClickedAction = {
  key: Events.NFT_ACTIVITY_CANCEL_CLICKED
  properties: {}
}

type ActivityChartEngagedAction = {
  key: Events.NFT_ACTIVITY_CHART_ENGAGED
  properties: {
    currency: string
    time_interval: object
  }
}

type AmountEnteredSwitchedAction = {
  key: Events.NFT_AMOUNT_ENTERED_SWITCHED
  properties: {}
}

type AssetClickedAction = {
  key: Events.NFT_ASSET_CLICKED
  properties: {
    collection_name: string
    contract_address: string
    token_id: string
  }
}

type AttributesClickedAction = {
  key: Events.NFT_ATTRIBUTES_CLICKED
  properties: {
    background: object
    clothes: object
    eyes: object
    hat: object
  }
}

type BuyNowClickedAction = {
  key: Events.NFT_BUY_NOW_CLICKED
  properties: {
    collection: string
    collection_id: string
  }
}

type BuyOnOpenSeaClickedAction = {
  key: Events.NFT_BUY_ON_OPENSEA_CLICKED
  properties: {}
}

type BuySuccessFailAction = {
  key: Events.NFT_BUY_SUCCESS_FAIL
  properties: {
    amount: number
    amount_usd: number
    currency: string
    error_message?: string
    type: Type
  }
}

type CancelListingClickedAction = {
  key: Events.NFT_CANCEL_LISTING_CLICKED
  properties: {}
}

type CancelListingSuccessFailAction = {
  key: Events.NFT_CANCEL_LISTING_SUCCESS_FAIL
  properties: {
    error_message?: string
    type: Type
  }
}

type CancelOfferClickedAction = {
  key: Events.NFT_CANCEL_OFFER_CLICKED
  properties: {}
}

type CancelOfferSuccessFailAction = {
  key: Events.NFT_CANCEL_OFFER_SUCCESS_FAIL
  properties: {
    amount: number
    amount_usd: number
    currency: string
    error_message?: string
    type: Type
  }
}

type ClickedAction = {
  key: Events.NFT_NFT_CLICKED
  properties: {
    collection_name: string
    image_logo: boolean
    name_click: boolean
  }
}

type CloseAndViewItemClickedAction = {
  key: Events.NFT_CLOSE_AND_VIEW_ITEM_CLICKED
  properties: {}
}

type ContractAddressClickedAction = {
  key: Events.NFT_CONTRACT_ADDRESS_CLICKED
  properties: {}
}

type EnteredAmountAction = {
  key: Events.NFT_ENTERED_AMOUNT
  properties: {
    currency: string
    input_amount: number
  }
}

type ExplorerClickedAction = {
  key: Events.NFT_EXPLORER_CLICKED
  properties: {}
}

type FilterClearAllClickedAction = {
  key: Events.NFT_FILTER_CLEAR_ALL_CLICKED
  properties: {}
}

type FilterListingTypeAction = {
  key: Events.NFT_FILTER_LISTING_TYPE
  properties: {
    buy_only: TurnOffOn
    lazy_minted: TurnOffOn
    verified_only: TurnOffOn
  }
}

type FilterPriceAppliedAction = {
  key: Events.NFT_FILTER_PRICE_APPLIED
  properties: {
    currency: string
    max_amount: number
    min_amount: number
  }
}

type FilterRemovedAction = {
  key: Events.NFT_FILTER_REMOVED
  properties: {
    filter_characteristic: string
  }
}

type GetStartedClickedAction = {
  key: Events.NFT_GET_STARTED_CLICKED
  properties: {}
}

type GoToPortfolioClickedAction = {
  key: Events.NFT_GO_TO_PORTFOLIO_CLICKED
  properties: {}
}

type LeftMenuClosedAction = {
  key: Events.NFT_LEFT_MENU_CLOSED
  properties: {}
}

type LeftMenuExpandedAction = {
  key: Events.NFT_LEFT_MENU_EXPANDED
  properties: {}
}

type ListingSuccessFailAction = {
  key: Events.NFT_LISTING_SUCCESS_FAIL
  properties: {
    currency: string
    end_price?: number
    end_usd?: number
    error_message?: string
    start_price: number
    start_usd: number
    type: Type
  }
}

type LoadMoreClickedAction = {
  key: Events.NFT_LOAD_MORE_CLICKED
  properties: {}
}

type MakeAnOfferClickedAction = {
  key: Events.NFT_MAKE_AN_OFFER_CLICKED
  properties: {}
}

type MAkeOfferWithClickedAction = {
  key: Events.NFT_MAKE_OFFER_WITH_CLICKED
  properties: {}
}

type MakeAnOfferViewedAction = {
  key: Events.NFT_MAKE_AN_OFFER_VIEWED
  properties: {}
}

type MarkForSaleAction = {
  key: Events.NFT_MARK_FOR_SALE
  properties: {
    collection: string
    collection_id: string
  }
}

type MoreClickedAction = {
  key: Events.NFT_MORE_CLICKED
  properties: {}
}

type OfferSuccessFailAction = {
  key: Events.NFT_OFFER_SUCCESS_FAIL
  properties: {
    amount: number
    amount_usd: number
    currency: string
    error_message?: string
    type: Type
  }
}

type OwnerClickedAction = {
  key: Events.NFT_OWNER_CLICKED
  properties: {}
}

type RecentlyListedClickedAction = {
  key: Events.NFT_RECENTLY_LISTED_CLICKED
  properties: {}
}

type RefreshMetadataClickedAction = {
  key: Events.NFT_REFRESH_METADATA_CLICKED
  properties: {}
}

type ReturnToMarketplaceClickedAction = {
  key: Events.NFT_RETURN_TO_MARKETPLACE_CLICKED
  properties: {}
}

type SellItemClickedAction = {
  key: Events.NFT_SELL_ITEM_CLICKED
  properties: {
    amount: number
    collection: string
    collection_id: string
    type: SaleType
  }
}

type SellItemSuccessFailAction = {
  key: Events.NFT_SELL_ITEM_SUCCESS_FAIL
  properties: {
    amount: number
    amount_usd: number
    currency: string
    error_message?: string
    type: Type
  }
}

type SendSuccessFailAction = {
  key: Events.NFT_SEND_SUCCESS_FAIL
  properties: {
    error_message?: string
    type: Type
  }
}

type ShareClickedAction = {
  key: Events.NFT_SHARE_CLICKED
  properties: {}
}

type TransferClickedAction = {
  key: Events.NFT_TRANSFER_CLICKED
  properties: {}
}

type TransferSuccessFailAction = {
  key: Events.NFT_TRANSFER_SUCCESS_FAIL
  properties: {
    collection_name: string
    contract_address: string
    from: string
    to: string
    token_id: string
    type: Type
  }
}

type ViewButtonViewedAction = {
  key: Events.NFT_VIEW_BUTTON_VIEWED
  properties: {}
}

type ViewSubmittedOfferClickedAction = {
  key: Events.NFT_VIEW_SUBMITTED_OFFER_CLICKED
  properties: {}
}

export type TrackEventAction =
  | AcceptOfferSuccessFailAction
  | AcceptOfferClickedAction
  | ActivityCancelClickedAction
  | ActivityChartEngagedAction
  | AmountEnteredSwitchedAction
  | AssetClickedAction
  | AttributesClickedAction
  | BuyNowClickedAction
  | BuyOnOpenSeaClickedAction
  | BuySuccessFailAction
  | CancelListingSuccessFailAction
  | CancelOfferSuccessFailAction
  | CancelListingClickedAction
  | CancelOfferClickedAction
  | ClickedAction
  | CloseAndViewItemClickedAction
  | ContractAddressClickedAction
  | EnteredAmountAction
  | ExplorerClickedAction
  | FilterClearAllClickedAction
  | FilterListingTypeAction
  | FilterPriceAppliedAction
  | FilterRemovedAction
  | GetStartedClickedAction
  | GoToPortfolioClickedAction
  | LeftMenuClosedAction
  | LeftMenuExpandedAction
  | ListingSuccessFailAction
  | LoadMoreClickedAction
  | MakeAnOfferClickedAction
  | MAkeOfferWithClickedAction
  | MakeAnOfferViewedAction
  | MarkForSaleAction
  | MoreClickedAction
  | OfferSuccessFailAction
  | OwnerClickedAction
  | RecentlyListedClickedAction
  | RefreshMetadataClickedAction
  | ReturnToMarketplaceClickedAction
  | SellItemClickedAction
  | SellItemSuccessFailAction
  | SendSuccessFailAction
  | ShareClickedAction
  | TransferClickedAction
  | TransferSuccessFailAction
  | ViewButtonViewedAction
  | ViewSubmittedOfferClickedAction
