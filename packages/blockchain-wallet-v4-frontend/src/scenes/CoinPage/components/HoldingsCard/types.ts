import { FC, ReactElement, ReactNode } from 'react'

export type HoldingsCardProps = {
  actions?: ReactElement[]
  coinCode: ReactNode
  coinTotal: ReactNode
  total: ReactNode
}

export type HoldingsCardComponent = FC<HoldingsCardProps>
