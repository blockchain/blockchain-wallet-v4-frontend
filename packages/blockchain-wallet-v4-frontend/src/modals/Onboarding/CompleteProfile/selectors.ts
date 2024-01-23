import { BSPaymentMethodsType, BSPaymentTypes, TermType } from '@core/types'
import { model, selectors } from 'data'
import { RootState } from 'data/rootReducer'

const { KYC_STATES } = model.profile

type ReturnData = {
  isBankOrCardLinked: boolean
  isBuyCrypto: boolean
  isKycPending: boolean
  isVerifiedId: boolean
}

export const getData = (state: RootState): ReturnData => {
  const userData = selectors.modules.profile.getUserData(state).getOrElse({
    kycState: undefined,
    tiers: { current: 0 }
  })

  const isKycPending = [KYC_STATES.PENDING, KYC_STATES.UNDER_REVIEW].includes(userData.kycState)

  const isKycVerified = userData.kycState === KYC_STATES.VERIFIED

  // user have some cards or banks linked
  const cards = selectors.components.buySell.getBSCards(state).getOrElse([])
  const paymentMethods = selectors.components.buySell
    .getBSPaymentMethods(state)
    .getOrElse({} as BSPaymentMethodsType)
  const isAnyBankLinked =
    paymentMethods?.methods?.length > 0 &&
    paymentMethods.methods.find(
      (method) => method.eligible && method.type === BSPaymentTypes.LINK_BANK
    )
  const isBankOrCardLinked = !!(cards.length > 0 || isAnyBankLinked)

  // user accumulated amount all the time
  const accumulatedTrades = selectors.components.buySell.getAccumulatedTrades(state).getOrElse([])

  const isBuyCrypto =
    Number(
      accumulatedTrades?.find((accumulated) => accumulated.termType === TermType.ALL)?.amount?.value
    ) > 0 ?? false

  return {
    isBankOrCardLinked,
    isBuyCrypto,
    isKycPending,
    isVerifiedId: isKycVerified
  }
}
