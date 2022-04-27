import { FC } from 'react'

import { CoinType } from '@core/types'

export type CoinWarningLogoProps = {
  coin: CoinType
  coinIconSize?: number
  severity?: 'warning'
  severityIconSize?: number
}

export type CoinWarningLogoComponent = FC<CoinWarningLogoProps>
