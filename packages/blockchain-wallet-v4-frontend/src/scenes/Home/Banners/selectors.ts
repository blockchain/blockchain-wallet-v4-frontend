import { TIER_TYPES } from 'blockchain-wallet-v4-frontend/src/modals/Settings/TradingLimits/model'
import { anyPass, equals } from 'ramda'

import { SBOrderType, SwapUserLimitsType } from 'blockchain-wallet-v4/src/types'
import { model, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { UserDataType } from 'data/types'

const { EXPIRED, GENERAL } = model.profile.DOC_RESUBMISSION_REASONS
export type BannerType =
  | 'resubmit'
  | 'sbOrder'
  | 'finishKyc'
  | 'newCurrency'
  | 'buyCrypto'
  | 'continueToGold'
  | null

export const getData = (state: RootState): { bannerToShow: BannerType } => {
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

  const limits = selectors.components.simpleBuy.getLimits(state).getOrElse({
    annual: {
      available: '0'
    }
  } as SwapUserLimitsType)

  const isTier3SDD = sddEligibleTier === 3

  let bannerToShow: BannerType = null
  if (showDocResubmitBanner) {
    bannerToShow = 'resubmit'
  } else if (isSimpleBuyOrderPending && !isTier3SDD) {
    bannerToShow = 'sbOrder'
  } else if (isKycStateNone && isUserActive && !isFirstLogin && !isTier3SDD) {
    bannerToShow = 'finishKyc'
  } else if (userData?.tiers?.current < 2 || isKycStateNone) {
    bannerToShow = 'buyCrypto'
  } else if (
    (userData?.tiers?.current === TIER_TYPES.SILVER ||
      userData?.tiers?.current === TIER_TYPES.SILVER_PLUS) &&
    limits?.annual.available &&
    Number(limits?.annual.available) > 0
  ) {
    bannerToShow = 'continueToGold'
  }

  return {
    bannerToShow
  }
}
