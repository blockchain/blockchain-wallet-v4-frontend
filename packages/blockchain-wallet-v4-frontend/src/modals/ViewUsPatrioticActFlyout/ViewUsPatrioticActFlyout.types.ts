import { FC } from 'react'

export type ViewTradingAccountFlyoutProps = {
  close?: () => void
  position: number
  total: number
  userClickedOutside?: boolean
}

export type ViewUsPatrioticActFlyoutComponent = FC<ViewTradingAccountFlyoutProps>
