export enum CaptchaActionName {
  LOGIN = 'LOGIN',
  RECOVER = 'RECOVER',
  RESET_2FA = 'RESET_2FA',
  SIGNUP = 'SIGNUP',
  UPGRADE_ACCOUNT = 'UPGRADE_ACCOUNT'
}
export type CaptchaActionType = keyof CaptchaActionName
