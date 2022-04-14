import { ReactNode } from 'react'

export type UseRecurringBuyPanelArgs = {
  coin: string
}

export type UseRecurringBuyPanelHook = (args: UseRecurringBuyPanelArgs) => [ReactNode]
