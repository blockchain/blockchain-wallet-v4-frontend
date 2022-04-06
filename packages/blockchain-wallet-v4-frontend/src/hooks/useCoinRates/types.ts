export type CoinRatesHookData = {
  price: number
  timestamp: Date
  volume24h: number
}
export type CoinRatesHookProps = {
  coin: string
}

export type CoinRatesHook = (props: CoinRatesHookProps) => { data?: CoinRatesHookData }
