import { FC, ReactNode } from 'react'

import { CoinType } from '@core/types'

export type CoinPageContainerProps = {
  coin: CoinType
}

export type CoinPageContainerComponent<T> = FC<CoinPageContainerProps & T>

export type CoinPageProps = {
  about?: ReactNode
  activity?: ReactNode
  alertCard?: ReactNode
  chart: ReactNode
  chartBalancePanel?: ReactNode
  chartTabs?: ReactNode
  favoriteButton?: ReactNode
  header: ReactNode
  holdings?: ReactNode
  promoCard?: ReactNode
  recurringBuys?: ReactNode
  wallets?: ReactNode
}

export type CoinPageComponent = FC<CoinPageProps>
