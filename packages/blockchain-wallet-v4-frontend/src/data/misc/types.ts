export enum CaptchaActionName {
  LOGIN = 'LOGIN',
  RECOVER = 'RECOVER',
  RESET_2FA = 'RESET_2FA',
  RESET_ACCOUNT = 'RESET_ACCOUNT',
  SIGNUP = 'SIGNUP'
}
export type CaptchaActionType = keyof CaptchaActionName
