import { FC } from 'react'

export type CoinHeaderProps = {
  coinCode: string
  coinDescription?: string
  coinName: string
}

export type CoinHeaderComponent = FC<CoinHeaderProps>
