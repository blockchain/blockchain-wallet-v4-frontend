import { ReactNode } from 'react'
import { Numeric } from 'd3-array'

export type EdgeConstrains = {
  bottom: number
  left: number
  right: number
  top: number
}

export type CoinData = { [key: string]: Numeric }

export type TooltipBuilder<DATA> = (state: {
  cursorLeft: number
  cursorTop: number
  getX: (data: DATA) => Date
  getY: (data: DATA) => Numeric
  tooltipData: DATA
  tooltipLeft: number
  tooltipTop: number
}) => ReactNode

export type CoinChartProps<
  DATA extends CoinData,
  X extends keyof DATA = keyof DATA,
  Y extends keyof DATA = keyof DATA
> = {
  backgroundColor: string
  data: DATA[]
  height: number
  margin?: EdgeConstrains
  numTicks?: number
  primaryColor: string
  textColor: string
  tooltip?: TooltipBuilder<DATA>
  width: number
  x: X
  xFormatter?: (x: DATA[X]) => string
  y: Y
}
