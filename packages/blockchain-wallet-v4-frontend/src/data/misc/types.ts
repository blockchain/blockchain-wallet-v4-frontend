export enum CaptchaActionName {
  EMAIL_REMINDER = 'EMAIL_REMINDER',
  EXCHANGE_LEGACY_LOGIN = 'EXCHANGE_LEGACY_LOGIN',
  RECOVER = 'RECOVER',
  RESET_2FA = 'RESET_2FA',
  SIGNUP = 'SIGNUP'
}
export type CaptchaActionType = keyof CaptchaActionName
