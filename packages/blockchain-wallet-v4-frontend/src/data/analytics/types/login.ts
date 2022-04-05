// Log in Events
export enum Events {
  LOGIN_DEVICE_VERIFIED = 'Device Verified',
  LOGIN_HELP_CLICKED = 'Login Help Clicked',
  LOGIN_IDENTIFIER_ENTERED = 'Login Identifier Entered',
  LOGIN_IDENTIFIER_FAILED = 'Login Identifier Failed',
  LOGIN_REQUEST_APPROVED = 'Login Request Approved',
  LOGIN_REQUEST_DENIED = 'Login Request Denied',
  LOGIN_TERMS_AND_CONDITIONS_ACCEPTED = 'T&C Accepted',
  LOGIN_TERMS_AND_CONDITIONS_VIEWED = 'T&C Viewed'
}

type TermsAndConditionsActions = {
  key:
    | Events.LOGIN_HELP_CLICKED
    | Events.LOGIN_DEVICE_VERIFIED
    | Events.LOGIN_IDENTIFIER_ENTERED
    | Events.LOGIN_IDENTIFIER_FAILED
    | Events.LOGIN_TERMS_AND_CONDITIONS_ACCEPTED
    | Events.LOGIN_TERMS_AND_CONDITIONS_VIEWED
    | Events.LOGIN_REQUEST_APPROVED
    | Events.LOGIN_REQUEST_DENIED
  properties: {}
}

// track event actions to be used inside codebase when we do trigger event
export type TrackEventAction = TermsAndConditionsActions
