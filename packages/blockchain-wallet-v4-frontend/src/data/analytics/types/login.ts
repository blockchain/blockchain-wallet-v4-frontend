export enum LoginEvents {
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
  LOGIN_VERIFY_DEVICE_VIEWED = 'Verify Your Device Viewed',
  LOGIN_VIEWED = 'Login Viewed'
}

export type LoginActions = {
  key: LoginEvents
  properties: {}
}
