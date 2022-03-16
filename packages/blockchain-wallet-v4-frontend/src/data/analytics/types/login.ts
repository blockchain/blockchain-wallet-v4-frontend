// Log in Events
export enum Events {
  LOGIN_TERMS_AND_CONDITIONS_ACCEPTED = 'T&C Accepted',
  LOGIN_TERMS_AND_CONDITIONS_VIEWED = 'T&C Viewed'
}

type TermsAndConditionsActions = {
  key: Events.LOGIN_TERMS_AND_CONDITIONS_ACCEPTED | Events.LOGIN_TERMS_AND_CONDITIONS_VIEWED
  properties: {}
}

// track event actions to be used inside codebase when we do trigger event
export type TrackEventAction = TermsAndConditionsActions
