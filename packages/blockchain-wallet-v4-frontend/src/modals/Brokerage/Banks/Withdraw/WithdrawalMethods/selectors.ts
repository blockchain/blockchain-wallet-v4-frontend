import { TIER_TYPES } from 'blockchain-wallet-v4-frontend/src/modals/Settings/TradingLimits/model'
import { lift } from 'ramda'

import { BSPaymentMethodsType, BSPaymentTypes, InvitationsType, RemoteDataType } from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

type SuccessStateType = {
  paymentMethods: BSPaymentMethodsType
  userCountryCode: string
  userTier: TIER_TYPES
}

const getData = (state: RootState): RemoteDataType<string, SuccessStateType> => {
  const paymentMethodsR = selectors.components.buySell.getBSPaymentMethods(state)
  // TODO: Remove this when Open Banking gets rolled out 100%
  const invitations: InvitationsType = selectors.core.settings.getInvitations(state).getOrElse({
    openBanking: false
  } as InvitationsType)

  const userTier = selectors.modules.profile.getCurrentTier(state)
  const userCountryCode = selectors.modules.profile.getUserCountryCode(state)

  const filterPaymentMethods = (methods) => {
    return methods.filter((m) => m.type === BSPaymentTypes.BANK_ACCOUNT || m.currency === 'USD')
  }

  return lift((paymentMethods, userTier, userCountryCode) => ({
    paymentMethods: invitations.openBanking
      ? paymentMethods
      : {
          ...paymentMethods,
          methods: filterPaymentMethods(paymentMethods.methods)
        },
    userCountryCode,
    userTier
  }))(paymentMethodsR, userTier, userCountryCode)
}

export default getData
