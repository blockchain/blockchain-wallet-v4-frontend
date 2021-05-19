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
  zxcvbn?: any
}
