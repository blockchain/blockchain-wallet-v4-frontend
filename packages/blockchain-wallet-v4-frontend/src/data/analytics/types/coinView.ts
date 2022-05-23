export enum Events {
  COINVIEW_EARN_REWARDS_BUTTON_CLICKED = 'Coin View Earn Rewards Clicked'
}

type CoinViewEarnRewardsButtonClick = {
  key: Events.COINVIEW_EARN_REWARDS_BUTTON_CLICKED
  properties: {
    currency: string
    device: string
    platform: string
  }
}

export type TrackEventAction = CoinViewEarnRewardsButtonClick
