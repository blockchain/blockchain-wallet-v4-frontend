import { lift } from 'ramda'

import {
  BSBalancesType,
  BSCardType,
  BSPairType,
  BSPaymentMethodsType,
  BSPaymentTypes,
  FiatEligibleType,
  FiatType,
  InvitationsType,
  RemoteDataType
} from '@core/types'
import { selectors } from 'data'
import { BankTransferAccountType } from 'data/types'

export type PaymentMethodsSelectorType = {
  applePayEnabled: boolean
  balances: BSBalancesType
  bankTransferAccounts: BankTransferAccountType[]
  cards: BSCardType[]
  eligibility: FiatEligibleType
  googlePayEnabled: boolean
  isInternalTester: boolean
  pairs: BSPairType
  paymentMethods: BSPaymentMethodsType
  walletCurrency: FiatType
}

const getData = (state): RemoteDataType<string, PaymentMethodsSelectorType> => {
  const balancesR = selectors.components.buySell.getBSBalances(state)
  const bankTransferAccountsR = selectors.components.brokerage.getBankTransferAccounts(state)
  const cardsR = selectors.components.buySell.getBSCards(state)
  const eligibilityR = selectors.components.buySell.getBSFiatEligible(state)
  const pairsR = selectors.components.buySell.getBSPairs(state)
  const paymentMethodsR = selectors.components.buySell.getBSPaymentMethods(state)
  // TODO: Remove this when Open Banking gets rolled out 100%
  const invitations: InvitationsType = selectors.core.settings.getInvitations(state).getOrElse({
    openBanking: false
  } as InvitationsType)
  const walletCurrencyR = selectors.core.settings.getCurrency(state)
  const applePayEnabledR = selectors.core.walletOptions.getApplePayAsNewPaymentMethod(state)
  const googlePayEnabledR = selectors.core.walletOptions.getGooglePayAsNewPaymentMethod(state)
  const isInternalTesterR = selectors.modules.profile.isInternalTester(state)

  return lift(
    (
      applePayEnabled,
      balances,
      bankTransferAccounts,
      cards,
      eligibility,
      googlePayEnabled,
      isInternalTester,
      pairs,
      paymentMethods,
      walletCurrency
    ) => ({
      applePayEnabled,
      balances,
      bankTransferAccounts,
      cards,
      eligibility,
      googlePayEnabled,
      isInternalTester,
      pairs,
      paymentMethods:
        (!invitations.openBanking && {
          ...paymentMethods,
          methods: paymentMethods.methods.filter(
            (m) =>
              m.type === BSPaymentTypes.BANK_ACCOUNT ||
              m.type === BSPaymentTypes.PAYMENT_CARD ||
              m.currency === 'USD'
          )
        }) ||
        paymentMethods,
      walletCurrency
    })
  )(
    applePayEnabledR,
    balancesR,
    bankTransferAccountsR,
    cardsR,
    eligibilityR,
    googlePayEnabledR,
    isInternalTesterR,
    pairsR,
    paymentMethodsR,
    walletCurrencyR
  )
}

export default getData
