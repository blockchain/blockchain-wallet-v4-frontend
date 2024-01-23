import { lift } from 'ramda'

import {
  BSPaymentMethodsType,
  BSPaymentTypes,
  ExtractSuccess,
  InvitationsType,
  RemoteDataType
} from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { BankTransferAccountType } from 'data/types'

type SuccessType = {
  bankAccounts: BankTransferAccountType[]
  paymentMethods: BSPaymentMethodsType
}

const getData = (state: RootState): RemoteDataType<string, SuccessType> => {
  const bankAccountsR = selectors.components.brokerage.getBankTransferAccounts(state)
  const paymentMethodsR = selectors.components.buySell.getBSPaymentMethods(state)

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
            return m.type === BSPaymentTypes.BANK_ACCOUNT || m.currency === 'USD'
          })
        }) ||
        paymentMethods
    })
  )(bankAccountsR, paymentMethodsR)
}

export default getData
