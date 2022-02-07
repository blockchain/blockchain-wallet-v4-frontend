import { lift } from 'ramda'

import { BSPaymentTypes, ExtractSuccess, FiatType, InvitationsType } from '@core/types'
import { selectors } from 'data'

const getData = (state) => {
  const balancesR = selectors.components.buySell.getBSBalances(state)
  const bankTransferAccountsR = selectors.components.brokerage.getBankTransferAccounts(state)
  const paymentMethodsR = selectors.components.buySell.getBSPaymentMethods(state)
  // TODO: Remove this when Open Banking gets rolled out 100%
  const invitations: InvitationsType = selectors.core.settings.getInvitations(state).getOrElse({
    openBanking: false
  } as InvitationsType)

  const userDataR = selectors.modules.profile.getUserData(state)
  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  return lift(
    (
      balances: ExtractSuccess<typeof balancesR>,
      bankTransferAccounts: ExtractSuccess<typeof bankTransferAccountsR>,
      paymentMethods: ExtractSuccess<typeof paymentMethodsR>,
      userData: ExtractSuccess<typeof userDataR>,
      walletCurrency: FiatType
    ) => ({
      balances,
      bankTransferAccounts,
      paymentMethods:
        (!invitations.openBanking && {
          ...paymentMethods,
          methods: paymentMethods.methods.filter((m) => {
            return m.type === BSPaymentTypes.BANK_ACCOUNT || m.currency === 'USD'
          })
        }) ||
        paymentMethods,
      userData,
      walletCurrency
    })
  )(balancesR, bankTransferAccountsR, paymentMethodsR, userDataR, walletCurrencyR)
}

export default getData
