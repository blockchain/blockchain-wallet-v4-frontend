import { lift } from 'ramda'

import { BSPaymentTypes, ExtractSuccess, FiatType, InvitationsType } from '@core/types'
import { selectors } from 'data'

const getData = (state) => {
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
  const isInternalTesterR = selectors.modules.profile.isInternalTester(state)

  return lift(
    (
      applePayEnabled: Boolean,
      balances: ExtractSuccess<typeof balancesR>,
      bankTransferAccounts: ExtractSuccess<typeof bankTransferAccountsR>,
      cards: ExtractSuccess<typeof cardsR>,
      eligibility: ExtractSuccess<typeof eligibilityR>,
      isInternalTester: ExtractSuccess<typeof isInternalTesterR>,
      pairs: ExtractSuccess<typeof pairsR>,
      paymentMethods: ExtractSuccess<typeof paymentMethodsR>,
      walletCurrency: FiatType
    ) => ({
      applePayEnabled,
      balances,
      bankTransferAccounts,
      cards,
      eligibility,
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
    isInternalTesterR,
    pairsR,
    paymentMethodsR,
    walletCurrencyR
  )
}

export default getData
