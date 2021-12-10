import { isEmpty } from 'ramda'

import { BSBalancesType, BSPaymentMethodsType, BSPaymentTypes } from '@core/types'
import { model, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { UserDataType } from 'data/types'

type ReturnData = {
  currentStep: number
  isBankOrCardLinked: boolean
  isBuyCrypto: boolean
  isVerifiedId: boolean
}

export const getData = (state: RootState): ReturnData => {
  let currentStep = 0
  let isVerifiedId = false
  let isBankOrCardLinked = false
  let isBuyCrypto = false
  const isKycStateNone =
    // @ts-ignore
    selectors.modules.profile.getUserKYCState(state).getOrElse('') === 'NONE'

  const isFirstLogin = selectors.auth.getFirstLogin(state)

  if (isFirstLogin || isKycStateNone) {
    return { currentStep, isBankOrCardLinked: false, isBuyCrypto: false, isVerifiedId: false }
  }

  const userDataR = selectors.modules.profile.getUserData(state)
  const userData = userDataR.getOrElse({
    tiers: { current: 0 }
  } as UserDataType)

  const { KYC_STATES } = model.profile
  const isKycPendingOrVerified =
    userData.kycState === KYC_STATES.PENDING ||
    userData.kycState === KYC_STATES.UNDER_REVIEW ||
    userData.kycState === KYC_STATES.VERIFIED

  if (isKycPendingOrVerified) {
    currentStep += 1
    isVerifiedId = true
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

  // user have some balance
  const balances = selectors.components.buySell.getBSBalances(state).getOrElse({} as BSBalancesType)
  if (!isEmpty(balances)) {
    if (
      Object.values(balances).some(
        (balance) => balance?.available && Number(balance?.available) > 0
      )
    ) {
      currentStep += 1
      isBuyCrypto = true
    }
  }

  return { currentStep, isBankOrCardLinked, isBuyCrypto, isVerifiedId }
}
