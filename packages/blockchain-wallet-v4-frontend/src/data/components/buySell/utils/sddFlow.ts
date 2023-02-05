import {
  BSPaymentMethodType,
  BSPaymentTypes,
  MobilePaymentType
} from '@core/network/api/buySell/types'
import { UserDataType } from 'data/modules/profile/types'

/**
 * Back-End allows only T1 SDD eligible+verified and T2 users to access Buy/Sell flows.
 * Thus, for purpose of these flows, T1 users are SDD users.
 */
const TIER = 1

export const isSddUser = (userData: UserDataType) => {
  const currentTier = userData.tiers.current

  return currentTier === TIER
}

export const isAllowedPaymentType = (
  method: BSPaymentMethodType,
  mobilePaymentType?: MobilePaymentType
) => {
  const isCardPayment = method.type === BSPaymentTypes.PAYMENT_CARD
  const isMobilePayment = !!mobilePaymentType

  return isCardPayment && !isMobilePayment
}
