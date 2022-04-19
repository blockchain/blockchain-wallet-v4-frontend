import { FC } from 'react'

export type ChartBalancePanelProps = {
  coinCode: string
  isPositive?: boolean
  pastHourChange: string
  pastHourPrice: string
  price: string
}

export type ChartBalancePanelComponent = FC<ChartBalancePanelProps>
