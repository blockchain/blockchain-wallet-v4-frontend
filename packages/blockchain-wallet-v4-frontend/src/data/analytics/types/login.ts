// Log in Events
export enum Events {
  LOGIN_2FA_PAGE_VIEWED = '2fa Page Viewed',
  LOGIN_CLICKED = 'Login Clicked',
  LOGIN_DEVICE_VERIFIED = 'Device Verified',
  LOGIN_FORGOT_PASSWORD_CLICKED = 'Forgot Your Password Clicked',
  LOGIN_HELP_CLICKED = 'Login Help Clicked',
  LOGIN_IDENTIFIER_ENTERED = 'Login Identifier Entered',
  LOGIN_IDENTIFIER_FAILED = 'Login Identifier Failed',
  LOGIN_PASSWORD_DENIED = 'Login Password Denied',
  LOGIN_PASSWORD_ENTERED = 'Login Password Entered',
  LOGIN_PASSWORD_INPUT_PAGE_ENTERED = 'Password Input Page Viewed',
  LOGIN_RECOVERY_OPTION_SELECTED = 'Recovery Option Selected',
  LOGIN_REQUEST_APPROVED = 'Login Request Approved',
  LOGIN_REQUEST_DENIED = 'Login Request Denied',
  LOGIN_SIGNED_IN = 'Signed In',
  LOGIN_SIGNED_OUT = 'Signed Out',
  LOGIN_TERMS_AND_CONDITIONS_ACCEPTED = 'T&C Accepted',
  LOGIN_TERMS_AND_CONDITIONS_VIEWED = 'T&C Viewed',
  LOGIN_TWO_STEP_VERIFICATION_DENIED = 'Login Two Step Verification Denied',
  LOGIN_TWO_STEP_VERIFICATION_ENTERED = 'Login Two Step Verification Entered',
  LOGIN_VIEWED = 'Login Viewed'
}

type LoginActions = {
  key:
    | Events.LOGIN_CLICKED
    | Events.LOGIN_SIGNED_OUT
    | Events.LOGIN_SIGNED_IN
    | Events.LOGIN_PASSWORD_ENTERED
    | Events.LOGIN_TWO_STEP_VERIFICATION_DENIED
    | Events.LOGIN_TWO_STEP_VERIFICATION_ENTERED
    | Events.LOGIN_RECOVERY_OPTION_SELECTED
    | Events.LOGIN_PASSWORD_DENIED
    | Events.LOGIN_HELP_CLICKED
    | Events.LOGIN_FORGOT_PASSWORD_CLICKED
    | Events.LOGIN_DEVICE_VERIFIED
    | Events.LOGIN_IDENTIFIER_ENTERED
    | Events.LOGIN_IDENTIFIER_FAILED
    | Events.LOGIN_TERMS_AND_CONDITIONS_ACCEPTED
    | Events.LOGIN_TERMS_AND_CONDITIONS_VIEWED
    | Events.LOGIN_REQUEST_APPROVED
    | Events.LOGIN_REQUEST_DENIED
    | Events.LOGIN_VIEWED
    | Events.LOGIN_PASSWORD_INPUT_PAGE_ENTERED
    | Events.LOGIN_2FA_PAGE_VIEWED
  properties: {}
}

// track event actions to be used inside codebase when we do trigger event
export type TrackEventAction = LoginActions
