export enum CaptchaActionName {
  EMAIL_REMINDER = 'EMAIL_REMINDER',
  EXCHANGE_LEGACY_LOGIN = 'EXCHANGE_LEGACY_LOGIN',
  RECOVER = 'RECOVER',
  RESET_2FA = 'RESET_2FA',
  RESET_ACCOUNT = 'RESET_ACCOUNT',
  SIGNUP = 'SIGNUP'
}
export type CaptchaActionType = keyof CaptchaActionName
