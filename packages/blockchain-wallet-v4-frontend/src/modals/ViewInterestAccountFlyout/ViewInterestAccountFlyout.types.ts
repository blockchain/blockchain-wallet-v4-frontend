import { FC } from 'react'

export type ViewInterestAccountFlyoutProps = {
  close?: () => void
  coin: string
  position: number
  total: number
  userClickedOutside?: boolean
}

export type ViewInterestAccountFlyoutComponent = FC<ViewInterestAccountFlyoutProps>
