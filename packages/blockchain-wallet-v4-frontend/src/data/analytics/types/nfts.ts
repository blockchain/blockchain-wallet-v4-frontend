// NFTs Events
export enum Events {
  NFT_ACCEPTED_ACCOUNTS = 'NFT Accepted Accounts',
  NFT_ACTIVITY_CANCEL_CLICKED = 'NFT Activity Cancel Clicked',
  NFT_ACTIVITY_CHART_ENGAGED = 'NFT Activity Chart Engaged',
  NFT_AMOUNT_ENTERED_SWITCHED = 'NFT Amount Entered Switched',
  NFT_ATTRIBUTES_CLICKED = 'NFT Attributes Clicked',
  NFT_BUY_NOW_CLICKED = 'NFT Buy Now Clicked',
  NFT_CLICKED = 'NFT Clicked',
  NFT_CLOSE_AND_VIEW_ITEM_CLICKED = 'NFT Close And View Item Clicked',
  NFT_CONTRACT_ADDRESS_CLICKED = 'NFT Contract Address Clicked',
  NFT_ENTERED_AMOUNT = 'NFT Entered Amount',
  NFT_EXPLORER_CLICKED = 'NFT Explorer Clicked',
  NFT_FILTER_CLEAR_ALL_CLICKED = 'NFT Filter Clear All Clicked',
  NFT_FILTER_LISTING_TYPE = 'NFT Filter Listing Type',
  NFT_FILTER_PRICE_APPLIED = 'NFT Filter Price Applied',
  NFT_FILTER_REMOVED = 'NFT Filter Removed',
  NFT_GO_TO_PORTFOLIO_CLICKED = 'NFT Go To Portfolio Clicked',
  NFT_LEFT_MENU_CLOSED = 'NFT Left Menu Closed',
  NFT_LEFT_MENU_EXPANDED = 'NFT Left Menu Expanded',
  NFT_LOAD_MORE_CLICKED = 'NFT Load More Clicked',
  NFT_MAKE_AN_OFFER_CLICKED = 'NFT Make An Offer Clicked',
  NFT_MAKE_AN_OFFER_VIEWED = 'NFT Make An Offer Viewed',
  NFT_MARK_FOR_SALE = 'NFT Mark For Sale',
  NFT_MORE_CLICKED = 'NFT More Clicked',
  NFT_OFFER_WITH_CLICKED = 'NFT Offer With Clicked',
  NFT_OWNER_CLICKED = 'NFT Owner clicked',
  NFT_RECENTLY_LISTED_CLICKED = 'NFT Recently Listed Clicked',
  NFT_REFRESH_METADATA_CLICKED = 'NFT Refresh Metadata Clicked',
  NFT_RETURN_TO_MARKETPLACE_CLICKED = 'NFT Return To Marketplace Clicked',
  NFT_SELL_ITEM_CLICKED = 'NFT Sell Item Clicked',
  NFT_SHARE_CLICKED = 'NFT Share Clicked',
  NFT_VIEW_BUTTON_VIEWED = 'NFT View Button Viewed',
  NFT_VIEW_SUBMITTED_OFFER_CLICKED = 'NFT View Submitted Offer Clicked'
}

type Accounts = 'USDT' | 'WETH'

type Platform = 'EXCHANGE'

type Origin = 'NFT_EXPLORER' | 'COLLECTION_PAGE' | 'HOME_PAGE' | 'BUY_NOW' | 'MAKE_OFFER'

type TurnOffOn = 'TURN_OFF' | 'TURN_ON'

type SaleType = 'FIXED_PRICE' | 'TIME_AUCTION'

type AcceptedAccountsAction = {
  key: Events.NFT_ACCEPTED_ACCOUNTS
  properties: {
    accounts: Accounts
  }
}

type ActivityCancelClickedAction = {
  key: Events.NFT_ACTIVITY_CANCEL_CLICKED
  properties: {
    platform: Platform
  }
}

type ActivityChartEngagedAction = {
  key: Events.NFT_ACTIVITY_CHART_ENGAGED
  properties: {
    currency: string
    origin: Origin
    platform: Platform
    time_interval: object
  }
}

type AmountEnteredSwitchedAction = {
  key: Events.NFT_AMOUNT_ENTERED_SWITCHED
  properties: {
    platform: Platform
  }
}

type AttributesClickedAction = {
  key: Events.NFT_ATTRIBUTES_CLICKED
  properties: {
    background: object
    clothes: object
    eyes: object
    hat: object
    platform: Platform
  }
}

type BuyNowClickedAction = {
  key: Events.NFT_BUY_NOW_CLICKED
  properties: {
    collection: string
    collection_id: string
    platform: Platform
  }
}

type ClickedAction = {
  key: Events.NFT_CLICKED
  properties: {
    collection_name: string
    image_logo: boolean
    name_click: boolean
    platform: Platform
  }
}

type CloseAndViewItemClickedAction = {
  key: Events.NFT_CLOSE_AND_VIEW_ITEM_CLICKED
  properties: {
    platform: Platform
  }
}

type ContractAddressClickedAction = {
  key: Events.NFT_CONTRACT_ADDRESS_CLICKED
  properties: {
    platform: Platform
  }
}

type EnteredAmountAction = {
  key: Events.NFT_ENTERED_AMOUNT
  properties: {
    amount_usd: number
    currency: string
    input_amount: number
    platform: Platform
  }
}

type ExplorerClickedAction = {
  key: Events.NFT_EXPLORER_CLICKED
  properties: {
    platform: Platform
  }
}

type FilterClearAllClickedAction = {
  key: Events.NFT_FILTER_CLEAR_ALL_CLICKED
  properties: {
    platform: Platform
  }
}

type FilterListingTypeAction = {
  key: Events.NFT_FILTER_LISTING_TYPE
  properties: {
    buy_only: TurnOffOn
    lazy_minted: TurnOffOn
    platform: Platform
    verified_only: TurnOffOn
  }
}

type FilterPriceAppliedAction = {
  key: Events.NFT_FILTER_PRICE_APPLIED
  properties: {
    currency: string
    max_amount: number
    min_amount: number
    platform: Platform
  }
}

type FilterRemovedAction = {
  key: Events.NFT_FILTER_REMOVED
  properties: {
    filter_characteristic: string
    platform: Platform
  }
}

type GoToPortfolioClickedAction = {
  key: Events.NFT_GO_TO_PORTFOLIO_CLICKED
  properties: {
    platform: Platform
  }
}

type LeftMenuClosedAction = {
  key: Events.NFT_LEFT_MENU_CLOSED
  properties: {
    origin: Origin
    platform: Platform
  }
}

type LeftMenuExpandedAction = {
  key: Events.NFT_LEFT_MENU_EXPANDED
  properties: {
    origin: Origin
    platform: Platform
  }
}

type LoadMoreClickedAction = {
  key: Events.NFT_LOAD_MORE_CLICKED
  properties: {
    platform: Platform
  }
}

type MakeAnOfferClickedAction = {
  key: Events.NFT_MAKE_AN_OFFER_CLICKED
  properties: {
    platform: Platform
  }
}

type MakeAnOfferViewedAction = {
  key: Events.NFT_MAKE_AN_OFFER_VIEWED
  properties: {
    platform: Platform
  }
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
  properties: {
    platform: Platform
  }
}

type OfferWithClickedAction = {
  key: Events.NFT_OFFER_WITH_CLICKED
  properties: {
    platform: Platform
  }
}

type OwnerclickedAction = {
  key: Events.NFT_OWNER_CLICKED
  properties: {
    platform: Platform
  }
}

type RecentlyListedClickedAction = {
  key: Events.NFT_RECENTLY_LISTED_CLICKED
  properties: {
    platform: Platform
  }
}

type RefreshMetadataClickedAction = {
  key: Events.NFT_REFRESH_METADATA_CLICKED
  properties: {
    platform: Platform
  }
}

type ReturnToMarketplaceClickedAction = {
  key: Events.NFT_RETURN_TO_MARKETPLACE_CLICKED
  properties: {
    origin: Origin
    platform: Platform
  }
}

type SellItemClickedAction = {
  key: Events.NFT_SELL_ITEM_CLICKED
  properties: {
    amount: number
    collection: string
    collection_id: string
    platform: Platform
    selling_fees: number
    type: SaleType
  }
}

type ShareClickedAction = {
  key: Events.NFT_SHARE_CLICKED
  properties: {
    platform: Platform
  }
}

type ViewButtonViewedAction = {
  key: Events.NFT_VIEW_BUTTON_VIEWED
  properties: {
    platform: Platform
  }
}

type ViewSubmittedOfferClickedAction = {
  key: Events.NFT_VIEW_SUBMITTED_OFFER_CLICKED
  properties: {
    platform: Platform
  }
}

export type TrackEventAction =
  | AcceptedAccountsAction
  | ActivityCancelClickedAction
  | ActivityChartEngagedAction
  | AmountEnteredSwitchedAction
  | AttributesClickedAction
  | BuyNowClickedAction
  | ClickedAction
  | CloseAndViewItemClickedAction
  | ContractAddressClickedAction
  | EnteredAmountAction
  | ExplorerClickedAction
  | FilterClearAllClickedAction
  | FilterListingTypeAction
  | FilterPriceAppliedAction
  | FilterRemovedAction
  | GoToPortfolioClickedAction
  | LeftMenuClosedAction
  | LeftMenuExpandedAction
  | LoadMoreClickedAction
  | MakeAnOfferClickedAction
  | MakeAnOfferViewedAction
  | MarkForSaleAction
  | MoreClickedAction
  | OfferWithClickedAction
  | OwnerclickedAction
  | RecentlyListedClickedAction
  | RefreshMetadataClickedAction
  | ReturnToMarketplaceClickedAction
  | SellItemClickedAction
  | ShareClickedAction
  | ViewButtonViewedAction
  | ViewSubmittedOfferClickedAction
