// NFTs Events
export enum NftsEvents {
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

type AcceptOfferSuccessFailAction = {
  key:
    | NftsEvents.NFT_ACCEPT_OFFER_SUCCESS_FAIL
    | NftsEvents.NFT_BUY_SUCCESS_FAIL
    | NftsEvents.NFT_CANCEL_OFFER_SUCCESS_FAIL
    | NftsEvents.NFT_OFFER_SUCCESS_FAIL
    | NftsEvents.NFT_SELL_ITEM_SUCCESS_FAIL
  properties: {
    amount: number
    amount_usd: number
    currency: string
    error_message?: string
    type: Type
  }
}

type ActivityChartEngagedAction = {
  key: NftsEvents.NFT_ACTIVITY_CHART_ENGAGED
  properties: {
    currency: string
    time_interval: object
  }
}

type AssetClickedAction = {
  key: NftsEvents.NFT_ASSET_CLICKED
  properties: {
    collection_name: string
    contract_address: string
    token_id: string
  }
}

type AttributesClickedAction = {
  key: NftsEvents.NFT_ATTRIBUTES_CLICKED
  properties: {
    background: object
    clothes: object
    eyes: object
    hat: object
  }
}

type BuyNowClickedAction = {
  key: NftsEvents.NFT_BUY_NOW_CLICKED
  properties: {
    collection: string
    collection_id: string
  }
}

type CancelListingSuccessFailAction = {
  key: NftsEvents.NFT_CANCEL_LISTING_SUCCESS_FAIL
  properties: {
    error_message?: string
    type: Type
  }
}

type ClickedAction = {
  key: NftsEvents.NFT_NFT_CLICKED
  properties: {
    collection_name: string
    image_logo: boolean
    name_click: boolean
  }
}

type EnteredAmountAction = {
  key: NftsEvents.NFT_ENTERED_AMOUNT
  properties: {
    currency: string
    input_amount: number
  }
}

type FilterListingTypeAction = {
  key: NftsEvents.NFT_FILTER_LISTING_TYPE
  properties: {
    buy_only: TurnOffOn
    lazy_minted: TurnOffOn
    verified_only: TurnOffOn
  }
}

type FilterPriceAppliedAction = {
  key: NftsEvents.NFT_FILTER_PRICE_APPLIED
  properties: {
    currency: string
    max_amount: number
    min_amount: number
  }
}

type FilterRemovedAction = {
  key: NftsEvents.NFT_FILTER_REMOVED
  properties: {
    filter_characteristic: string
  }
}

type ListingSuccessFailAction = {
  key: NftsEvents.NFT_LISTING_SUCCESS_FAIL
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

type MarkForSaleAction = {
  key: NftsEvents.NFT_MARK_FOR_SALE
  properties: {
    collection: string
    collection_id: string
  }
}

type SellItemClickedAction = {
  key: NftsEvents.NFT_SELL_ITEM_CLICKED
  properties: {
    amount: number
    collection: string
    collection_id: string
    type: SaleType
  }
}

type SendSuccessFailAction = {
  key: NftsEvents.NFT_SEND_SUCCESS_FAIL
  properties: {
    error_message?: string
    type: Type
  }
}

type TransferSuccessFailAction = {
  key: NftsEvents.NFT_TRANSFER_SUCCESS_FAIL
  properties: {
    collection_name: string
    contract_address: string
    from: string
    to: string
    token_id: string
    type: Type
  }
}

type NFTGenericActions = {
  key:
    | NftsEvents.NFT_CANCEL_OFFER_CLICKED
    | NftsEvents.NFT_CANCEL_LISTING_CLICKED
    | NftsEvents.NFT_CLOSE_AND_VIEW_ITEM_CLICKED
    | NftsEvents.NFT_CONTRACT_ADDRESS_CLICKED
    | NftsEvents.NFT_EXPLORER_CLICKED
    | NftsEvents.NFT_FILTER_CLEAR_ALL_CLICKED
    | NftsEvents.NFT_BUY_ON_OPENSEA_CLICKED
    | NftsEvents.NFT_ACCEPT_OFFER_CLICKED
    | NftsEvents.NFT_ACTIVITY_CANCEL_CLICKED
    | NftsEvents.NFT_AMOUNT_ENTERED_SWITCHED
    | NftsEvents.NFT_GET_STARTED_CLICKED
    | NftsEvents.NFT_GO_TO_PORTFOLIO_CLICKED
    | NftsEvents.NFT_LEFT_MENU_CLOSED
    | NftsEvents.NFT_LEFT_MENU_EXPANDED
    | NftsEvents.NFT_LOAD_MORE_CLICKED
    | NftsEvents.NFT_MAKE_AN_OFFER_CLICKED
    | NftsEvents.NFT_MAKE_OFFER_WITH_CLICKED
    | NftsEvents.NFT_MAKE_AN_OFFER_VIEWED
    | NftsEvents.NFT_MORE_CLICKED
    | NftsEvents.NFT_OWNER_CLICKED
    | NftsEvents.NFT_RECENTLY_LISTED_CLICKED
    | NftsEvents.NFT_REFRESH_METADATA_CLICKED
    | NftsEvents.NFT_RETURN_TO_MARKETPLACE_CLICKED
    | NftsEvents.NFT_SHARE_CLICKED
    | NftsEvents.NFT_TRANSFER_CLICKED
    | NftsEvents.NFT_VIEW_BUTTON_VIEWED
    | NftsEvents.NFT_VIEW_SUBMITTED_OFFER_CLICKED
  properties: {}
}

export type NftsTrackEventActions =
  | AcceptOfferSuccessFailAction
  | ActivityChartEngagedAction
  | AssetClickedAction
  | AttributesClickedAction
  | BuyNowClickedAction
  | CancelListingSuccessFailAction
  | ClickedAction
  | EnteredAmountAction
  | FilterListingTypeAction
  | FilterPriceAppliedAction
  | FilterRemovedAction
  | ListingSuccessFailAction
  | MarkForSaleAction
  | SellItemClickedAction
  | SendSuccessFailAction
  | TransferSuccessFailAction
  | NFTGenericActions
