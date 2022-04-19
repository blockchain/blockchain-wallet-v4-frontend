import { FC, ReactElement } from 'react'

export type HoldingsCardProps = {
  actions: ReactElement[]
  coinCode: string
  coinTotal: string
  total: string
}

export type HoldingsCardComponent = FC<HoldingsCardProps>
