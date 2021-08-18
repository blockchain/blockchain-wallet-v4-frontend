import { CoinfigType } from 'core/types'

declare global {
  interface Window {
    APP_VERSION: string
    CAPTCHA_KEY: string
    NONCE: string
    coins: {
      [key in string]: {
        coinfig: CoinfigType
      }
    }
    zxcvbn?: any
  }
}
