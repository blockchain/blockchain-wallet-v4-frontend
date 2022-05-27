// Misc Wallet Events
export enum Events {
  WRONG_CHANGE_CACHE = 'Wrong Change Cache',
  WRONG_RECEIVE_CACHE = 'Wrong Receive Cache'
}

type MiscTrackEventAction = {
  key: Events.WRONG_CHANGE_CACHE | Events.WRONG_RECEIVE_CACHE
  properties: {}
}

// track event actions to be used inside codebase when we do trigger event
export type TrackEventAction = MiscTrackEventAction
