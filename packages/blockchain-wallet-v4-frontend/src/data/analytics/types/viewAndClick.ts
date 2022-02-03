// View and Click Events
export enum Events {
  VIEW_AND_CLICK_FIAT_CURRENCY_SELECTED = 'Fiat Currency Selected'
}

type ClickFiatCurrencyAction = {
  key: Events.VIEW_AND_CLICK_FIAT_CURRENCY_SELECTED
  properties: {
    currency: String
  }
}

// track event actions to be used inside codebase when we do trigger event
export type TrackEventAction = ClickFiatCurrencyAction

// shared types
type BasePayload = {
  originalTimestamp: string
}
type FiatCurrencyProperties = BasePayload & {
  currency: string
}

// analytics properties to be used for analytics queue typing
export type AnalyticsProperties = BasePayload | FiatCurrencyProperties
