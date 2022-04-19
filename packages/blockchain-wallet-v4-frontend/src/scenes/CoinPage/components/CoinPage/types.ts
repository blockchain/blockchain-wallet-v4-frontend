import { FC, ReactNode } from 'react'

export type CoinPageProps = {
  about?: ReactNode
  activity?: ReactNode
  chart: ReactNode
  chartBalancePanel?: ReactNode
  chartTabs?: ReactNode
  favoriteButton?: ReactNode
  header: ReactNode
  promoCard?: ReactNode
  recurringBuys?: ReactNode
  wallets?: ReactNode
} & (
  | {
      alertCard?: never
      holdings?: ReactNode
    }
  | {
      alertCard?: ReactNode
      holdings?: never
    }
)

export type CoinPageComponent = FC<CoinPageProps>
