// Misc Wallet Events
export enum Events {
  CUSTOMER_SUPPORT_CLICKED = 'Customer Support Clicked',
  SIGNUP_VIEWED = 'Signup Viewed',
  VERIFY_DEVICE_EMAIL_CONFIRMED = 'Verify Your Device Email Confirmed',
  WRONG_CHANGE_CACHE = 'Wrong Change Cache',
  WRONG_RECEIVE_CACHE = 'Wrong Receive Cache'
}

type MiscTrackEventAction = {
  key: Events
  properties: {}
}

// track event actions to be used inside codebase when we do trigger event
export type TrackEventAction = MiscTrackEventAction
