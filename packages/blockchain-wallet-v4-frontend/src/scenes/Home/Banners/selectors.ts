import { anyPass, equals } from 'ramda'
import { model, selectors } from 'data'
import { SBOrderType } from 'core/types'

const { GENERAL, EXPIRED } = model.profile.DOC_RESUBMISSION_REASONS
export type BannerType =
  | 'resubmit'
  | 'sbOrder'
  | 'finishKyc'
  | 'coinifyToSb'
  | 'verifiedKyc'
  | 'noneKyc'

export const getData = (state): { bannerToShow: BannerType } => {
  // @ts-ignore
  const showDocResubmitBanner = selectors.modules.profile
    .getKycDocResubmissionStatus(state)
    .map(anyPass([equals(GENERAL), equals(EXPIRED)]))
    .getOrElse(false)

  // const balancesR = selectors.components.simpleBuy.getSBBalances(state)
  const ordersR = selectors.components.simpleBuy.getSBOrders(state)
  const orders: Array<SBOrderType> = ordersR.getOrElse([])
  // const balances = balancesR.getOrElse({})
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

  // const isKycGold =
  //   // @ts-ignore
  //   selectors.modules.profile.getUserKYCState(state).getOrElse('') ===
  //   'VERIFIED'

  // const coins = selectors.components.utils
  //   .getSupportedCoinsWithMethodAndOrder(state)
  //   .getOrElse([])

  // const methodWithNoBalance = coins.filter(
  //   coin =>
  //     coin.coinCode in FiatTypeEnum &&
  //     coin.method &&
  //     !balances[coin.coinCode as WalletCurrencyType]
  // ).length

  let bannerToShow
  if (showDocResubmitBanner) {
    bannerToShow = 'resubmit'
  } else if (isSimpleBuyOrderPending) {
    bannerToShow = 'sbOrder'
  } else if (isKycStateNone && isUserActive && !isFirstLogin) {
    bannerToShow = 'finishKyc'
    // } else if (isKycStateNone && methodWithNoBalance) {
    //   bannerToShow = 'noneKyc'
    // } else if (isKycGold && methodWithNoBalance) {
    //   bannerToShow = 'verifiedKyc'
  } else {
    bannerToShow = null
  }

  return {
    bannerToShow
  }
}
