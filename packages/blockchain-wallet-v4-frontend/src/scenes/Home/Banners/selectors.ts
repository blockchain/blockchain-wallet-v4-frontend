import { anyPass, equals } from 'ramda'
import { model, selectors } from 'data'
import { Remote } from 'blockchain-wallet-v4/src'
import { SBOrderType } from 'core/types'

const { GENERAL, EXPIRED } = model.profile.DOC_RESUBMISSION_REASONS
export type BannerType = 'resubmit' | 'sbOrder' | 'finishKyc' | 'coinifyToSb'

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
    // @ts-ignore
    selectors.modules.profile.getUserActivationState(state).getOrElse('') !==
    'NONE'
  const isKycStateNone =
    // @ts-ignore
    selectors.modules.profile.getUserKYCState(state).getOrElse('') === 'NONE'
  const isFirstLogin = selectors.auth.getFirstLogin(state)
  const isCoinifyUser = selectors.core.kvStore.buySell
    .getCoinifyUser(state)
    .getOrElse(false)

  let bannerToShow
  if (showDocResubmitBanner) {
    bannerToShow = 'resubmit'
  } else if (
    isCoinifyUser &&
    !isSimpleBuyOrderPending &&
    Remote.Success.is(ordersR)
  ) {
    bannerToShow = 'coinifyToSb'
  } else if (isKycStateNone && isUserActive && !isFirstLogin) {
    bannerToShow = 'finishKyc'
  } else if (isSimpleBuyOrderPending) {
    bannerToShow = 'sbOrder'
  } else {
    bannerToShow = null
  }

  return {
    bannerToShow
  }
}
