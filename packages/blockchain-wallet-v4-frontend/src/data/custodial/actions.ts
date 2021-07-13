import {
  BeneficiariesType,
  WalletFiatType
} from 'blockchain-wallet-v4/src/types'

import * as AT from './actionTypes'
import { CustodialActionTypes } from './types'

export const fetchCustodialBeneficiaries = (currency?: WalletFiatType) => ({
  type: AT.FETCH_CUSTODIAL_BENEFICIARIES,
  currency
})
export const fetchCustodialBeneficiariesFailure = (
  error: string
): CustodialActionTypes => ({
  type: AT.FETCH_CUSTODIAL_BENEFICIARIES_FAILURE,
  payload: {
    error
  }
})
export const fetchCustodialBeneficiariesLoading = (): CustodialActionTypes => ({
  type: AT.FETCH_CUSTODIAL_BENEFICIARIES_LOADING
})
export const fetchCustodialBeneficiariesSuccess = (
  beneficiaries: BeneficiariesType
): CustodialActionTypes => ({
  type: AT.FETCH_CUSTODIAL_BENEFICIARIES_SUCCESS,
  payload: {
    beneficiaries
  }
})
