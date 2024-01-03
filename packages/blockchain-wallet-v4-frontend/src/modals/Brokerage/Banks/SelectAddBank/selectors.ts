import { lift } from 'ramda'

import { BSPaymentMethodsType, RemoteDataType } from '@core/types'
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
  const plaidEnabledR = selectors.core.walletOptions.getAddPlaidPaymentProvider(state)
  const userDataR = selectors.modules.profile.getUserData(state)

  return lift((paymentMethods, plaidEnabled, userData) => ({
    paymentMethods,
    plaidEnabled,
    userData
  }))(paymentMethodsR, plaidEnabledR, userDataR)
}

export default getData
