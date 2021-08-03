interface Window {
  APP_VERSION: string
  CAPTCHA_KEY: string
  NONCE: string
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
          isMemoBased?: boolean
          logoPngUrl: string
          minimumOnChainConfirmations?: number
          name: string
          parentChain: string
          websiteUrl: string
        }
      }
    }
  }
  zxcvbn?: any
}
