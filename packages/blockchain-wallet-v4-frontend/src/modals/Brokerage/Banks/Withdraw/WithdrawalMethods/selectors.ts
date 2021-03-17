import { lift } from 'ramda'

import { ExtractSuccess, FiatType } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

export const getData = state => {
  const balancesR = selectors.components.simpleBuy.getSBBalances(state)
  const bankTransferAccountsR = selectors.components.brokerage.getBankTransferAccounts(
    state
  )
  const paymentMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(
    state
  )
  // TODO: Remove this when ach deposits withdrawals gets rolled out hundo P
  const invitationsR = selectors.core.settings.getInvitations(state)
  const isInvited = invitationsR.data.achDepositWithdrawal

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
        (!isInvited && {
          ...paymentMethods,
          methods: paymentMethods.methods.filter(m => m.type === 'BANK_ACCOUNT')
        }) ||
        paymentMethods,
      userData,
      walletCurrency
    })
  )(
    balancesR,
    bankTransferAccountsR,
    paymentMethodsR,
    userDataR,
    walletCurrencyR
  )
}
