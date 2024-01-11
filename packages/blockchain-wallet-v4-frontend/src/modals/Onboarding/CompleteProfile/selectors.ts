import { BSPaymentMethodsType, BSPaymentTypes, TermType } from '@core/types'
import { model, selectors } from 'data'
import { RootState } from 'data/rootReducer'

const { KYC_STATES } = model.profile

type ReturnData = {
  currentStep: number
  isBankOrCardLinked: boolean
  isBuyCrypto: boolean
  isKycPending: boolean
  isVerifiedId: boolean
}

export const getData = (state: RootState): ReturnData => {
  const isKycStateNone =
    selectors.modules.profile.getUserKYCState(state).getOrElse('') === KYC_STATES.NONE

  const isFirstLogin = selectors.signup.getFirstLogin(state)

  if (isFirstLogin || isKycStateNone) {
    return {
      currentStep: 0,
      isBankOrCardLinked: false,
      isBuyCrypto: false,
      isKycPending: false,
      isVerifiedId: false
    }
  }

  const userData = selectors.modules.profile.getUserData(state).getOrElse({
    kycState: undefined,
    tiers: { current: 0 }
  })

  let currentStep = 0
  let isBankOrCardLinked = false

  const isKycPending =
    userData.kycState === KYC_STATES.PENDING || userData.kycState === KYC_STATES.UNDER_REVIEW

  const isKycVerified = userData.kycState === KYC_STATES.VERIFIED

  if (isKycVerified) {
    currentStep += 1
  }

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
  if (cards.length > 0 || isAnyBankLinked) {
    currentStep += 1
    isBankOrCardLinked = true
  }

  let isBuyCrypto = false
  // user accumulated amount all the time
  const accumulatedTrades = selectors.components.buySell.getAccumulatedTrades(state).getOrElse([])

  if (accumulatedTrades.length > 0) {
    const allAccumulated = accumulatedTrades.find(
      (accumulated) => accumulated.termType === TermType.ALL
    )
    if (Number(allAccumulated?.amount?.value) > 0) {
      currentStep += 1
      isBuyCrypto = true
    }
  }

  return {
    currentStep,
    isBankOrCardLinked,
    isBuyCrypto,
    isKycPending,
    isVerifiedId: isKycVerified
  }
}
