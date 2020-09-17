import * as AT from './actionTypes'
import {
  BeneficiaryType,
  WalletFiatType,
  WithdrawalMinsAndFeesResponse
} from 'core/types'
import { WithdrawActionTypes, WithdrawStepActionsPayload } from './types'

export const handleCustodyWithdraw = (
  amount: string,
  beneficiary: BeneficiaryType,
  fiatCurrency: WalletFiatType
) => ({
  type: AT.HANDLE_WITHDRAW_SUBMIT,
  payload: {
    amount,
    beneficiary,
    fiatCurrency
  }
})

export const setStep = (payload: WithdrawStepActionsPayload) => ({
  type: AT.SET_STEP,
  payload
})

export const showModal = (fiatCurrency: WalletFiatType) => ({
  type: AT.SHOW_MODAL,
  payload: {
    fiatCurrency
  }
})

export const fetchWithdrawalFees = (currency?: WalletFiatType) => ({
  type: AT.FETCH_WITHDRAWAL_FEES,
  currency
})

export const fetchWithdrawalFeesFailure = (
  error: string
): WithdrawActionTypes => ({
  type: AT.FETCH_WITHDRAWAL_FEES_FAILURE,
  payload: {
    error
  }
})

export const fetchWithdrawalFeesLoading = (): WithdrawActionTypes => ({
  type: AT.FETCH_WITHDRAWAL_FEES_LOADING
})

export const fetchWithdrawalFeesSuccess = (
  withdrawFeesRespons: WithdrawalMinsAndFeesResponse
): WithdrawActionTypes => ({
  type: AT.FETCH_WITHDRAWAL_FEES_SUCCESS,
  payload: {
    withdrawFeesRespons
  }
})
