import { FC } from 'react'

export type ChartBalancePanelProps = {
  coinCode: string
  pastHourDelta: number
  pastHourPrice: string
  price: string
}

export type ChartBalancePanelComponent = FC<ChartBalancePanelProps>
