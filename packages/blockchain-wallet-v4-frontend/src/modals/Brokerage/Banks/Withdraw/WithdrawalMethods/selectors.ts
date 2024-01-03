import { lift } from 'ramda'

import { BSPaymentMethodsType, BSPaymentTypes, InvitationsType, RemoteDataType } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'
import { UserDataType } from 'data/types'

type SuccessStateType = {
  paymentMethods: BSPaymentMethodsType
  plaidEnabled: boolean
  userData: UserDataType
}

const getData = (state: RootState): RemoteDataType<string, SuccessStateType> => {
  const paymentMethodsR = selectors.components.buySell.getBSPaymentMethods(state)
  // TODO: Remove this when Open Banking gets rolled out 100%
  const invitations: InvitationsType = selectors.core.settings.getInvitations(state).getOrElse({
    openBanking: false
  } as InvitationsType)

  const plaidEnabledR = selectors.core.walletOptions.getAddPlaidPaymentProvider(state)
  const userDataR = selectors.modules.profile.getUserData(state)

  return lift((paymentMethods, plaidEnabled, userData) => ({
    paymentMethods:
      (!invitations.openBanking && {
        ...paymentMethods,
        methods: paymentMethods.methods.filter((m) => {
          return m.type === BSPaymentTypes.BANK_ACCOUNT || m.currency === 'USD'
        })
      }) ||
      paymentMethods,
    plaidEnabled,
    userData
  }))(paymentMethodsR, plaidEnabledR, userDataR)
}

export default getData
