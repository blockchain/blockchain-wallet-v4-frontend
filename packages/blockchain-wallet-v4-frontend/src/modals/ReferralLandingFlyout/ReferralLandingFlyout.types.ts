import { FC } from 'react'

import { ReferralInformationType } from 'data/components/referral/types'

export type ReferralLandingFlyoutProps = {
  close?: () => void
  hasCowboysTag: {} | false
  position: number
  referralInformation: ReferralInformationType | undefined
  total: number
  userClickedOutside?: boolean
}

export type ReferralLandingFlyoutComponent = FC<ReferralLandingFlyoutProps>
