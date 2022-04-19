import { ReactNode } from 'react'

export type UseChartBalancePanelResult = [ReactNode]

export type UseChartBalancePanelArgs = {
  coin: string
}

export type UseChartBalancePanel = (args: UseChartBalancePanelArgs) => UseChartBalancePanelResult
