export enum ViewAndClickEvents {
  BANNER_REWARDS_CLICKED = 'Banner Rewards Clicked',
  BANNER_REWARDS_VIEWED = 'Banner Rewards Viewed',
  VIEW_AND_CLICK_FIAT_CURRENCY_SELECTED = 'Fiat Currency Selected'
}

type BannerEarnRewards = {
  key: ViewAndClickEvents.BANNER_REWARDS_VIEWED | ViewAndClickEvents.BANNER_REWARDS_CLICKED
  properties: {}
}

type ClickFiatCurrencyAction = {
  key: ViewAndClickEvents.VIEW_AND_CLICK_FIAT_CURRENCY_SELECTED
  properties: {
    currency: String
  }
}

// track event actions to be used inside codebase when we do trigger event
export type ViewAndClickActions = ClickFiatCurrencyAction | BannerEarnRewards

export type ViewAndClickAnalyticsProperties = {
  currency: string
  originalTimestamp: string
}
