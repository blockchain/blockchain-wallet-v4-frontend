import { FC } from 'react'

export type ViewTradingAccountFlyoutProps = {
  close?: () => void
  coin: string
  position: number
  total: number
  userClickedOutside?: boolean
}

export type ViewTradingAccountFlyoutComponent = FC<ViewTradingAccountFlyoutProps>
