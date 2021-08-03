import { BeneficiariesType, SwapOrderType, WalletFiatType } from 'blockchain-wallet-v4/src/types'

import * as AT from './actionTypes'
import { CustodialActionTypes } from './types'

export const fetchCustodialBeneficiaries = (currency?: WalletFiatType) => ({
  currency,
  type: AT.FETCH_CUSTODIAL_BENEFICIARIES
})
export const fetchCustodialBeneficiariesFailure = (error: string): CustodialActionTypes => ({
  payload: {
    error
  },
  type: AT.FETCH_CUSTODIAL_BENEFICIARIES_FAILURE
})
export const fetchCustodialBeneficiariesLoading = (): CustodialActionTypes => ({
  type: AT.FETCH_CUSTODIAL_BENEFICIARIES_LOADING
})
export const fetchCustodialBeneficiariesSuccess = (
  beneficiaries: BeneficiariesType
): CustodialActionTypes => ({
  payload: {
    beneficiaries
  },
  type: AT.FETCH_CUSTODIAL_BENEFICIARIES_SUCCESS
})

export const fetchRecentSwapTxs = () => ({
  type: AT.FETCH_RECENT_SWAP_TXS
})

export const fetchRecentSwapTxsFailure = (): CustodialActionTypes => ({
  type: AT.FETCH_RECENT_SWAP_TXS_FAILURE
})

export const fetchRecentSwapTxsLoading = (): CustodialActionTypes => ({
  type: AT.FETCH_RECENT_SWAP_TXS_LOADING
})

export const fetchRecentSwapTxsSuccess = (data: SwapOrderType[]): CustodialActionTypes => ({
  payload: {
    data
  },
  type: AT.FETCH_RECENT_SWAP_TXS_SUCCESS
})
