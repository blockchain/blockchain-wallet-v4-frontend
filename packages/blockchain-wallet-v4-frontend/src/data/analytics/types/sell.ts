export enum Events {
  COIN_VIEW_SELL_CLICKED = 'Coin View Sell Clicked',
  FAB_SELL_CLICKED = 'FAB Sell Clicked',
  PRICES_PAGE_SELL_CLICKED = 'Prices Page Sell Clicked',
  SELL_AMOUNT_SCREEN_BACK_CLICKED = 'Sell Amount Screen Back Clicked',
  SELL_AMOUNT_SCREEN_NEXT_CLICKED = 'Sell Amount Screen Next Clicked',
  SELL_AMOUNT_SCREEN_VIEWED = 'Sell Amount Screen Viewed',
  SELL_ASSET_SCREEN_VIEWED = 'Sell Asset Screen Viewed',
  SELL_ASSET_SELECTED = 'Sell Asset Selected',
  SELL_CHECKOUT_NETWORK_FEES_CLICKED = 'Sell Checkout Network Fees Clicked',
  SELL_CHECKOUT_SCREEN_BACK_CLICKED = 'Sell Checkout Screen Back Clicked',
  SELL_CHECKOUT_SCREEN_SUBMITTED = 'Sell Checkout Screen Submitted',
  SELL_CHECKOUT_VIEWED = 'Sell Checkout Viewed',
  SELL_FIAT_CRYPTO_SWITCHER_CLICKED = 'Sell Fiat Crypto Switcher Clicked',
  SELL_PRICE_TOOLTIP_CLICKED = 'Sell Price Tooltip Clicked'
}

export type TrackEventAction = {
  key: Events
  properties: {}
}
