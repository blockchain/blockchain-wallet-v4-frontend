import { lift } from 'ramda'

import { ExtractSuccess, InvitationsType, SBPaymentTypes } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

const getData = (state: RootState) => {
  const bankAccountsR = selectors.components.brokerage.getBankTransferAccounts(state)

  const paymentMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(state)

  // TODO: Remove this when Open Banking gets rolled out 100%
  const invitations: InvitationsType = selectors.core.settings.getInvitations(state).getOrElse({
    openBanking: false
  } as InvitationsType)
  return lift(
    (
      bankAccounts: ExtractSuccess<typeof bankAccountsR>,
      paymentMethods: ExtractSuccess<typeof paymentMethodsR>
    ) => ({
      bankAccounts,
      paymentMethods:
        (!invitations.openBanking && {
          ...paymentMethods,
          methods: paymentMethods.methods.filter((m) => {
            return m.type === SBPaymentTypes.BANK_ACCOUNT || m.currency === 'USD'
          })
        }) ||
        paymentMethods
    })
  )(bankAccountsR, paymentMethodsR)
}

export default getData
