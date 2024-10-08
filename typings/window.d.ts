import { CoinfigType } from '@core/types'

declare global {
  type Coins = {
    [key in string]: {
      coinfig: CoinfigType // all coin configs for app
    }
  }

  /**
   * Number in standard form stored as a string.
   */
  type StandardNumericString = string

  interface Window {
    APP_VERSION: string // build injected app version
    ApplePaySession?: ApplePaySession
    BCAndroidSSI: any // android <-> web messaging
    CAPTCHA_KEY: string
    // build injected recaptcha key
    SARDINE_CLIENT_ID: string
    // build injected sardine access key
    SARDINE_ENVIRONMENT: string
    // Sardine integration
    WALLET_V5_LINK: string
    // sardine environment sandbox or production
    _Sardine: any
    // Sardine integration
    _SardineContext: any
    coins: Coins
    grecaptcha: any // google recaptcha sets this on window
    history?: {
      pushState: any
    }
    nonce: string // build/server injected recaptcha key
    receiveMessageFromMobile: (any) => void // mobile <-> web messaging
    webkit: any // iOS <-> web messaging
  }
}
