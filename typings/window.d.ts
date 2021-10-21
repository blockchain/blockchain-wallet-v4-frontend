import { CoinfigType } from '@core/types'

declare global {
  interface Window {
    APP_VERSION: string
    Android: any
    CAPTCHA_KEY: string
    NONCE: string
    coins: {
      [key in string]: {
        coinfig: CoinfigType
      }
    }
    grecaptcha: any
    receiveMessageFromMobile: (any) => void
    webkit: any
    zxcvbn?: any
  }
}
