import { SBOrderType } from 'blockchain-wallet-v4/src/types'
import { anyPass, equals } from 'ramda'

import { model, selectors } from 'data'
import { UserDataType } from 'data/types'

const { EXPIRED, GENERAL } = model.profile.DOC_RESUBMISSION_REASONS
export type BannerType =
  | 'resubmit'
  | 'sbOrder'
  | 'finishKyc'
  | 'newCurrency'
  | 'buyCrypto'
  | 'continueToGold'

export const getData = (state): { bannerToShow: BannerType } => {
  // @ts-ignore
  const showDocResubmitBanner = selectors.modules.profile
    .getKycDocResubmissionStatus(state)
    .map(anyPass([equals(GENERAL), equals(EXPIRED)]))
    .getOrElse(false)
  const ordersR = selectors.components.simpleBuy.getSBOrders(state)
  const orders: Array<SBOrderType> = ordersR.getOrElse([])
  const isSimpleBuyOrderPending = orders.find(
    order =>
      order.state === 'PENDING_CONFIRMATION' ||
      order.state === 'PENDING_DEPOSIT'
  )

  const isUserActive =
    selectors.modules.profile.getUserActivationState(state).getOrElse('') !==
    'NONE'
  const isKycStateNone =
    // @ts-ignore
    selectors.modules.profile.getUserKYCState(state).getOrElse('') === 'NONE'
  const isFirstLogin = selectors.auth.getFirstLogin(state)

  const userDataR = selectors.modules.profile.getUserData(state)
  const userData = userDataR.getOrElse({
    tiers: { current: 0 }
  } as UserDataType)

  const sddEligibleTier = selectors.components.simpleBuy
    .getUserSddEligibleTier(state)
    .getOrElse(1)

  const isTier3SDD = sddEligibleTier === 3

  let bannerToShow
  if (showDocResubmitBanner && !isTier3SDD) {
    bannerToShow = 'resubmit'
  } else if (isSimpleBuyOrderPending && !isTier3SDD) {
    bannerToShow = 'sbOrder'
  } else if (isKycStateNone && isUserActive && !isFirstLogin && !isTier3SDD) {
    bannerToShow = 'finishKyc'
  } else if (isFirstLogin && (userData?.tiers?.current < 2 || isKycStateNone)) {
    bannerToShow = 'buyCrypto'
  } else if (isTier3SDD) {
    bannerToShow = 'continueToGold'
  } else {
    bannerToShow = null
  }

  return {
    bannerToShow
  }
}
