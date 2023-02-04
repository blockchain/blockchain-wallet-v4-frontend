import { FC, ReactElement, ReactNode } from 'react'

import { CoinfigType } from '@core/types'

export type HoldingsCardProps = {
  actions?: ReactElement[]
  coinCode: ReactNode
  coinTotal: ReactNode
  coinfig?: CoinfigType
  total: ReactNode
}

export type HoldingsCardComponent = FC<HoldingsCardProps>
