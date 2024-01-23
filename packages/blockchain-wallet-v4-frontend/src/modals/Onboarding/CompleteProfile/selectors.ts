import { BSPaymentMethodsType, BSPaymentTypes } from '@core/types'
import { model, selectors } from 'data'
import { RootState } from 'data/rootReducer'

const { KYC_STATES } = model.profile

type ReturnData = {
  isBankOrCardLinked: boolean
  isKycVerified: boolean
}

export const getData = (state: RootState): ReturnData => {
  const userData = selectors.modules.profile.getUserData(state).getOrElse({ kycState: undefined })
  const isKycVerified = userData.kycState === KYC_STATES.VERIFIED

  // Check if user has cards or banks linked
  const hasLinkedCards = selectors.components.buySell.getBSCards(state).getOrElse([]).length > 0
  const paymentMethods = selectors.components.buySell
    .getBSPaymentMethods(state)
    .getOrElse({} as BSPaymentMethodsType)
  const hasLinkedBank = paymentMethods?.methods?.some(
    (method) => method.eligible && method.type === BSPaymentTypes.LINK_BANK
  )
  const isBankOrCardLinked = hasLinkedCards || hasLinkedBank

  return {
    isBankOrCardLinked,
    isKycVerified
  }
}
