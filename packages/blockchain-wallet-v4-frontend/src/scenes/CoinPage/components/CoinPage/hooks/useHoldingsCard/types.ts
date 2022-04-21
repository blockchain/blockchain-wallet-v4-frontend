import { ReactNode } from 'react'

export type HoldingsCardHookProps = {
  coin: string
}

export type HoldingsCardHook = (props: HoldingsCardHookProps) => [ReactNode]
