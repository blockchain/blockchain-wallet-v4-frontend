export type CoinBalanceHoookProps = { coin: string }

export type CoinBalanceHook = (props: CoinBalanceHoookProps) => {
  data?: number
}
