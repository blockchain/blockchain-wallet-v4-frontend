import { anyPass, equals } from 'ramda'
import { model, selectors } from 'data'
import { SBOrderType } from 'core/types'

const { GENERAL, EXPIRED } = model.profile.DOC_RESUBMISSION_REASONS

export const getData = state => {
  // @ts-ignore
  const showDocResubmitBanner = selectors.modules.profile
    .getKycDocResubmissionStatus(state)
    .map(anyPass([equals(GENERAL), equals(EXPIRED)]))
    .getOrElse(false)

  const orders: Array<SBOrderType> = selectors.components.simpleBuy
    .getSBOrders(state)
    .getOrElse([])
  const isSimpleBuyOrderPending = orders.find(
    order =>
      order.state === 'PENDING_CONFIRMATION' ||
      order.state === 'PENDING_DEPOSIT'
  )

  let bannerToShow
  if (showDocResubmitBanner) {
    bannerToShow = 'resubmit'
  } else if (isSimpleBuyOrderPending) {
    bannerToShow = 'sbOrder'
  } else {
    bannerToShow = null
  }

  return {
    bannerToShow
  }
}
