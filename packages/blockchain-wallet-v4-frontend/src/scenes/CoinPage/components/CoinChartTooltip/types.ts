import { FC } from 'react'

export type CoinChartTooltipProps = {
  left: number
  offsetLeft?: number
  offsetTop?: number
  subtitle: string
  title: string
  top: number
}

export type CoinChartTooltipComponent = FC<CoinChartTooltipProps>
