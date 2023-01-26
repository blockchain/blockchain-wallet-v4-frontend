export enum Events {
  FAB_SWAP_CLICKED = 'FAB Swap Clicked',
  PRICES_PAGE_SWAP_CLICKED = 'Prices Page Swap Clicked',
  PRICE_GRAPH_SWAP_CLICKED = 'Price Graph Swap Clicked',
  SWAP_ACCOUNTS_SELECTED = 'Swap Accounts Selected',
  SWAP_AMOUNT_SCREEN_BACK_CLICKED = 'Swap Amount Screen Back Clicked',
  SWAP_AMOUNT_SCREEN_NEXT_CLICKED = 'Swap Amount Screen Next Clicked',
  SWAP_CHECKOUT_NETWORK_FEES_CLICKED = 'Swap Checkout Network Fees Clicked',
  SWAP_CHECKOUT_SCREEN_BACK_CLICKED = 'Swap Checkout Screen Back Clicked',
  SWAP_CHECKOUT_SCREEN_SUBMITTED = 'Swap Checkout Screen Submitted',
  SWAP_CHECKOUT_VIEWED = 'Swap Checkout Viewed',
  SWAP_EARN_REWARDS_BUTTON_CLICKED = 'Swap Earn Rewards Clicked',
  SWAP_EARN_REWARDS_BUTTON_VIEWED = 'Swap Earn Rewards Viewed',
  SWAP_FIAT_CRYPTO_CLICKED = 'Swap Fiat Crypto Clicked',
  SWAP_FROM_WALLET_PAGE_CLICKED = 'Swap From Wallet Page Clicked',
  SWAP_FROM_WALLET_PAGE_VIEWED = 'Swap From Wallet Page Viewed',
  SWAP_PRICE_TOOLTIP_CLICKED = 'Swap Price Tooltip Clicked',
  SWAP_RECEIVE_WALLET_PAGE_CLICKED = 'Swap Receive Wallet Page Clicked',
  SWAP_RECEIVE_WALLET_PAGE_VIEWED = 'Swap Receive Wallet Page Viewed'
}

type SwapAccountsSelected = {
  key: Events.SWAP_ACCOUNTS_SELECTED
  properties: {
    input_currency: string
    input_type: string
    output_currency: string
    output_type: string
    was_suggested: boolean
  }
}

type SwapEarnRewardsButtonClick = {
  key: Events.SWAP_EARN_REWARDS_BUTTON_CLICKED
  properties: {
    currency: string
    device: string
  }
}

type SwapEarnRewardsButtonView = {
  key: Events.SWAP_EARN_REWARDS_BUTTON_VIEWED
  properties: {
    currency: string
    device: string
  }
}

export type TrackEventAction =
  | SwapAccountsSelected
  | SwapEarnRewardsButtonClick
  | SwapEarnRewardsButtonView
  | {
      key: Exclude<
        Events,
        | SwapAccountsSelected['key']
        | SwapEarnRewardsButtonClick['key']
        | SwapEarnRewardsButtonView['key']
      >
      properties: {}
    }
