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
