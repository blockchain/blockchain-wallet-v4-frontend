import { CoinfigType } from '@core/types'

declare global {
  interface Window {
    APP_VERSION: string // build injected app version
    BCAndroidSSI: any // android <-> web messaging
    CAPTCHA_KEY: string // build injected recaptcha key
    NONCE: string // build/server injected recaptcha key
    coins: {
      [key in string]: {
        coinfig: CoinfigType // all coin configs for app
      }
    }
    grecaptcha: any // google recaptcha sets this on window
    receiveMessageFromMobile: (any) => void // mobile <-> web messaging
    webkit: any // iOS <-> web messaging
    zxcvbn?: any // TODO: delete this once password strength checker is gone
  }
}
