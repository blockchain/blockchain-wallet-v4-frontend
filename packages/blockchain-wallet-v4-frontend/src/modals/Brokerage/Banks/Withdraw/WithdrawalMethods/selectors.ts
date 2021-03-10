import { lift } from 'ramda'

import { ExtractSuccess, FiatType } from 'blockchain-wallet-v4/src/types'
import { selectors } from 'data'

export const getData = state => {
  const balancesR = selectors.components.simpleBuy.getSBBalances(state)
  const bankTransferAccountsR = selectors.components.brokerage.getBankTransferAccounts(
    state
  )
  // TODO: Move payment methods reducer to brokerage
  const paymentMethodsR = selectors.components.simpleBuy.getSBPaymentMethods(
    state
  )
  // TODO: Remove this when ach deposits withdrawals gets rolled out hundo P
  const brokerageDepositsWithdrawalsR = selectors.core.walletOptions.getBrokerageDepositsWithdrawals(
    state
  )
  const brokerageDepositsWithdrawals = brokerageDepositsWithdrawalsR.getOrElse(
    false
  )

  const walletCurrencyR = selectors.core.settings.getCurrency(state)

  return lift(
    (
      balances: ExtractSuccess<typeof balancesR>,
      bankTransferAccounts: ExtractSuccess<typeof bankTransferAccountsR>,
      paymentMethods: ExtractSuccess<typeof paymentMethodsR>,
      walletCurrency: FiatType
    ) => ({
      balances,
      bankTransferAccounts,
      paymentMethods:
        (!brokerageDepositsWithdrawals && {
          ...paymentMethods,
          methods: paymentMethods.methods.filter(m => m.type === 'BANK_ACCOUNT')
        }) ||
        paymentMethods,
      walletCurrency
    })
  )(balancesR, bankTransferAccountsR, paymentMethodsR, walletCurrencyR)
}
