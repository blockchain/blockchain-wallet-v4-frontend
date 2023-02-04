import { FC } from 'react'

import { CoinfigType } from '@core/types'

export type CoinHeaderProps = {
  coinCode: string
  coinDescription?: string
  coinfig?: CoinfigType
}

export type CoinHeaderComponent = FC<CoinHeaderProps>
