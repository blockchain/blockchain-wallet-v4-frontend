interface Window {
  coins: {
    [key in string]: {
      coinfig: {
        name: string
        precision: number
        products: string[]
        symbol: string
        type: {
          erc20Address?: string
          isFiat?: boolean
          logoPngUrl: string
          name: string
          parentChain: string
          websiteUrl: string
        }
      }
    }
  }
  APP_VERSION: string
  CAPTCHA_KEY: string
  NONCE: string
  zxcvbn?: any
}