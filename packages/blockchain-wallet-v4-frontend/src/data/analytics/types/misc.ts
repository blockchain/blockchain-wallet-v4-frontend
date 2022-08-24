// Misc Wallet Events
export enum Events {
  CUSTOMER_SUPPORT_CLICKED = 'Customer Support Clicked',
  SIGNUP_VIEWED = 'Signup Viewed',
  WRONG_CHANGE_CACHE = 'Wrong Change Cache',
  WRONG_RECEIVE_CACHE = 'Wrong Receive Cache'
}

type MiscTrackEventAction = {
  key:
    | Events.CUSTOMER_SUPPORT_CLICKED
    | Events.WRONG_CHANGE_CACHE
    | Events.WRONG_RECEIVE_CACHE
    | Events.SIGNUP_VIEWED
  properties: {}
}

// track event actions to be used inside codebase when we do trigger event
export type TrackEventAction = MiscTrackEventAction
