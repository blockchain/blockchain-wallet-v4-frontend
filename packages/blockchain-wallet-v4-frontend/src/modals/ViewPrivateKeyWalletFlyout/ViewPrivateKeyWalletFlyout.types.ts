import { FC } from 'react'

export type ViewPrivateKeyWalletFlyoutProps = {
  close?: () => void
  coin: string
  position: number
  total: number
  userClickedOutside?: boolean
}

export type ViewPrivateKeyWalletFlyoutComponent = FC<ViewPrivateKeyWalletFlyoutProps>
