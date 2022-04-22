import { isEmpty } from 'ramda'

import { BSPaymentMethodsType, BSPaymentTypes, TermType, TradeAccumulatedItem } from '@core/types'
import { model, selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { UserDataType } from 'data/types'

export const getData = (state: RootState): { currentStep: number } => {
  let currentStep = 0
  const isKycStateNone =
    // @ts-ignore
    selectors.modules.profile.getUserKYCState(state).getOrElse('') === 'NONE'

  const isFirstLogin = selectors.signup.getFirstLogin(state)

  if (isFirstLogin || isKycStateNone) {
    return { currentStep }
  }

  const userDataR = selectors.modules.profile.getUserData(state)
  const userData = userDataR.getOrElse({
    tiers: { current: 0 }
  } as UserDataType)

  const { KYC_STATES } = model.profile
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
  }

  // user accumulated amount all the time
  const accumulatedTrades = selectors.components.buySell
    .getAccumulatedTrades(state)
    .getOrElse([] as TradeAccumulatedItem[])
  if (!isEmpty(accumulatedTrades)) {
    const allAccumulated = accumulatedTrades.find(
      (accumulated) => accumulated.termType === TermType.ALL
    )
    if (Number(allAccumulated?.amount?.value) > 0) {
      currentStep += 1
    }
  }

  return { currentStep }
}
