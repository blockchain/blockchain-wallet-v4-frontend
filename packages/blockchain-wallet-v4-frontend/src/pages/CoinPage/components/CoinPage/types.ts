import { FC, ReactNode } from 'react'

export type CoinPageProps = {
  about?: ReactNode
  activity?: ReactNode
  alertCard?: ReactNode
  chart: ReactNode
  favoriteButton?: ReactNode
  header: ReactNode
  holdings?: ReactNode
  promoCard?: ReactNode
  recurringBuys?: ReactNode
  wallets?: ReactNode
}

export type CoinPageComponent = FC<CoinPageProps>
