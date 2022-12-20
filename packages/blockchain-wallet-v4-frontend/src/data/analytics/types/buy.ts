export enum Events {
  BUY_AMOUNT_SCREEN_BACK_CLICKED = 'Buy Amount Screen Back Clicked',
  BUY_AMOUNT_SCREEN_NEXT_CLICKED = 'Buy Amount Screen Next Clicked',
  BUY_AMOUNT_SCREEN_VIEWED = 'Buy Amount Screen Viewed',
  BUY_ASSET_SCREEN_VIEWED = 'Buy Asset Screen Viewed',
  BUY_ASSET_SELECTED = 'Buy Asset Selected',
  BUY_BLOCKCHAIN_COM_FEE_CLICKED = 'Buy Blockchain Com Fee Clicked',
  BUY_CHANGE_PAYMENT_METHOD_CLICKED = 'Buy Change Payment Method Clicked',
  BUY_CHECKOUT_SCREEN_BACK_CLICKED = 'Buy Checkout Screen Back Clicked',
  BUY_CHECKOUT_SCREEN_SUBMITTED = 'Buy Checkout Screen Submitted',
  BUY_CHECKOUT_SCREEN_VIEWED = 'Buy Checkout Screen Viewed',
  BUY_PAYMENT_METHOD_ADD_NEW_CLICKED = 'Buy Payment Method Add New Clicked',
  BUY_PAYMENT_METHOD_CHANGED = 'Buy Payment Method Changed',
  BUY_PRICE_TOOLTIP_CLICKED = 'Buy Price Tooltip Clicked',
  COIN_VIEW_BUY_CLICKED = 'Coin View Buy Clicked',
  FAB_BUY_CLICKED = 'FAB Buy Clicked',
  FAB_CLICKED = 'FAB Clicked',
  PRICES_PAGE_BUY_CLICKED = 'Prices Page Buy Clicked',
  PRICE_GRAPH_BUY_CLICKED = 'Price Graph Buy Clicked'
}

type BuyAmountScreenNextClicked = {
  key: Events.BUY_AMOUNT_SCREEN_NEXT_CLICKED
  properties: {
    input_amount?: string
    input_currency: string
    output_currency: string
    payment_method?: string
  }
}

type BuyPaymentMethodChanged = {
  key: Events.BUY_PAYMENT_METHOD_CHANGED
  properties: {
    payment_type: string
  }
}

export type TrackEventAction =
  | BuyAmountScreenNextClicked
  | BuyPaymentMethodChanged
  | {
      key: Exclude<Events, BuyAmountScreenNextClicked['key'] | BuyPaymentMethodChanged['key']>
      properties: {}
    }
