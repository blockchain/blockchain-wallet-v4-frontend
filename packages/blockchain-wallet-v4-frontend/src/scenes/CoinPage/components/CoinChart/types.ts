import { Numeric } from 'd3-array'

export type CoinData = { [key: string]: Numeric }

export type CoinChartProps<
  DATA extends CoinData,
  X extends keyof DATA = keyof DATA,
  Y extends keyof DATA = keyof DATA
> = {
  backgroundColor: string
  data: DATA[]
  primaryColor: string
  textColor: string
  x: X
  xFormatter?: (x: DATA[X]) => string
  y: Y
}
