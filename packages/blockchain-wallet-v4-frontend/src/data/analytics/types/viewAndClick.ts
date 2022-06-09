// View and Click Events
export enum Events {
  BANNER_REWARDS_CLICKED = 'Banner Rewards Clicked',
  BANNER_REWARDS_VIEWED = 'Banner Rewards Viewed',
  VIEW_AND_CLICK_FIAT_CURRENCY_SELECTED = 'Fiat Currency Selected'
}

type BannerEarnRewardsButtonView = {
  key: Events.BANNER_REWARDS_VIEWED
  properties: {
    device: 'APP-Android' | 'APP-iOS' | 'WEB'
    platform: 'EXCHANGE' | 'WALLET'
  }
}

type BannerEarnRewardsButtonClick = {
  key: Events.BANNER_REWARDS_CLICKED
  properties: {
    device: 'APP-Android' | 'APP-iOS' | 'WEB'
    platform: 'EXCHANGE' | 'WALLET'
  }
}

type ClickFiatCurrencyAction = {
  key: Events.VIEW_AND_CLICK_FIAT_CURRENCY_SELECTED
  properties: {
    currency: String
  }
}

// track event actions to be used inside codebase when we do trigger event
export type TrackEventAction =
  | ClickFiatCurrencyAction
  | BannerEarnRewardsButtonView
  | BannerEarnRewardsButtonClick

// shared types
type BasePayload = {
  originalTimestamp: string
}
type FiatCurrencyProperties = BasePayload & {
  currency: string
}

// analytics properties to be used for analytics queue typing
export type AnalyticsProperties = BasePayload | FiatCurrencyProperties
