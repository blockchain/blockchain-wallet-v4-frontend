export type CoinRatesHookData = {
  price: number
  timestamp: number
  volume24h: number
}
export type CoinRatesHookProps = {
  coin: string
}

export type CoinRatesHook = (props: CoinRatesHookProps) => { data?: CoinRatesHookData }
