import { lift } from 'ramda'

import {
  ExtractSuccess,
  FiatType,
  InvitationsType,
  SBPaymentTypes
} from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

const getData = (state) => {
  const balancesR = selectors.components.simpleBuy.getSBBalances(state)
  const bankTransferAccountsR = selectors.components.brokerage.getBankTransferAccounts(state)
  const cardsR = selectors.components.simpleBuy.getSBCards(state)
  const eligibilityR = selectors.components.simpleBuy.getSBFiatEligible(state)
  const pairsR = selectors.components.simpleBuy.getSBPairs(state)
  const paymentMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(state)
  // TODO: Remove this when Open Banking gets rolled out 100%
  const invitations: InvitationsType = selectors.core.settings.getInvitations(state).getOrElse({
    openBanking: false
  } as InvitationsType)
  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  return lift(
    (
      balances: ExtractSuccess<typeof balancesR>,
      bankTransferAccounts: ExtractSuccess<typeof bankTransferAccountsR>,
      cards: ExtractSuccess<typeof cardsR>,
      eligibility: ExtractSuccess<typeof eligibilityR>,
      pairs: ExtractSuccess<typeof pairsR>,
      paymentMethods: ExtractSuccess<typeof paymentMethodsR>,
      walletCurrency: FiatType
    ) => ({
      balances,
      bankTransferAccounts,
      cards,
      eligibility,
      pairs,
      paymentMethods:
        (!invitations.openBanking && {
          ...paymentMethods,
          methods: paymentMethods.methods.filter(
            (m) =>
              m.type === SBPaymentTypes.BANK_ACCOUNT ||
              m.type === SBPaymentTypes.PAYMENT_CARD ||
              m.currency === 'USD'
          )
        }) ||
        paymentMethods,
      walletCurrency
    })
  )(
    balancesR,
    bankTransferAccountsR,
    cardsR,
    eligibilityR,
    pairsR,
    paymentMethodsR,
    walletCurrencyR
  )
}

export default getData
