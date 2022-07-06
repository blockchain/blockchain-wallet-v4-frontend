export enum Events {
  SWAP_EARN_REWARDS_BUTTON_CLICKED = 'Swap Earn Rewards Clicked',
  SWAP_EARN_REWARDS_BUTTON_VIEWED = 'Swap Earn Rewards Viewed'
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

export type TrackEventAction = SwapEarnRewardsButtonClick | SwapEarnRewardsButtonView
