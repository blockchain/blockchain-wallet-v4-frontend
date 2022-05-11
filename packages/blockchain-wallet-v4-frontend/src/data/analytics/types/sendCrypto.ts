// Send Crypto Events
export enum Events {
  SEND_AMOUNT_ENTERED = 'Send Amount Entered',
  SEND_SUBMITTED = 'Send Submitted'
}

type LoginActions = {
  key: Events.SEND_AMOUNT_ENTERED | Events.SEND_SUBMITTED
  properties: {}
}

// track event actions to be used inside codebase when we do trigger event
export type TrackEventAction = LoginActions
