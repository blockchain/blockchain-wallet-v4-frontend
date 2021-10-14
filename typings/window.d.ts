import { CoinfigType } from '@core/types'

declare global {
  interface Window {
    Android: any
    APP_VERSION: string
    CAPTCHA_KEY: string
    NONCE: string
    coins: {
      [key in string]: {
        coinfig: CoinfigType
      }
    }
    receiveMessageFromMobile: (any) => void
    webkit: any
    zxcvbn?: any
  }
}
