export enum CoinViewEvents {
  COINVIEW_EARN_REWARDS_BUTTON_CLICKED = 'Coin View Earn Rewards Clicked'
}

export type CoinViewActions = {
  key: CoinViewEvents.COINVIEW_EARN_REWARDS_BUTTON_CLICKED
  properties: {
    currency: string
    device: string
    platform: string
  }
}
