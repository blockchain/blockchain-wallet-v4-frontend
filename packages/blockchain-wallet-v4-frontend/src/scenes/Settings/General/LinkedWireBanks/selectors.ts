import { lift } from 'ramda'

import {
  BeneficiariesType,
  BSPaymentMethodsType,
  ExtractSuccess,
  RemoteDataType
} from '@core/types'
import { selectors } from 'data'
import { RootState } from 'data/rootReducer'

type SuccessType = {
  beneficiaries: BeneficiariesType
  paymentMethods: BSPaymentMethodsType
}

export const getData = (state: RootState): RemoteDataType<any, SuccessType> => {
  const beneficiariesR = selectors.custodial.getBeneficiaries(state)
  const paymentMethodsR = selectors.components.buySell.getBSPaymentMethods(state)

  return lift((beneficiaries, paymentMethods) => ({
    beneficiaries,
    paymentMethods
  }))(beneficiariesR, paymentMethodsR)
}
