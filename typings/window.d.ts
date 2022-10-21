import { CoinfigType } from '@core/types'

declare global {
  interface Window {
    APP_VERSION: string // build injected app version
    ApplePaySession?: ApplePaySession
    BCAndroidSSI: any // android <-> web messaging
    CAPTCHA_KEY: string // build injected recaptcha key
    SARDINE_CLIENT_ID: string // build injected sardine access key
    _Sardine: any // Sardine integration
    coins: {
      [key in string]: {
        coinfig: CoinfigType // all coin configs for app
      }
    }
    grecaptcha: any // google recaptcha sets this on window
    history?: {
      pushState: any
    }
    nonce: string // build/server injected recaptcha key
    receiveMessageFromMobile: (any) => void // mobile <-> web messaging
    webkit: any // iOS <-> web messaging
  }
}
