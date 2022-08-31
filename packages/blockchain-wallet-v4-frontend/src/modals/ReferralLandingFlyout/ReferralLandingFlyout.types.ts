import { FC } from 'react'

export type ReferralLandingFlyoutProps = {
  close?: () => void
  position: number
  total: number
  userClickedOutside?: boolean
}

export type ReferralLandingFlyoutComponent = FC<ReferralLandingFlyoutProps>
