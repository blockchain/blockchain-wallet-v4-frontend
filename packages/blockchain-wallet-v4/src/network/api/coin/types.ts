export type BuildTxResponseType = {
  preImages: [
    {
      descriptor: null | string
      preImage: string
      signatureAlgorithm: 'secp256k1'
      signingKey: string
    }
  ]
  rawTx: {}
  txSummary: {
    absoluteFeeEstimate: string
    absoluteFeeMaximum: string
    amount: string
    balance: string
    relativeFee: string
  }
}

export type IndexMultiResponseType = {
  [key in string]: {
    price: number
    timestamp: number
    volume24h: number
  }
}

export type TickerResponseType = {
  [key in string]: {
    '15m': number
    buy: number
    last: number
    sell: number
    symbol: string
  }
}
