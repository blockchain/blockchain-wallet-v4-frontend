import {
  BankTransferAccountType,
  BeneficiaryType,
  SBPaymentTypes,
  WalletFiatType,
  WithdrawalLockResponseType,
  WithdrawalMinsAndFeesResponse
} from 'blockchain-wallet-v4/src/types'

import * as AT from './actionTypes'
import { WithdrawActionTypes, WithdrawStepActionsPayload } from './types'

export const handleCustodyWithdraw = (
  amount: string,
  beneficiary: BeneficiaryType | BankTransferAccountType | null,
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

export const fetchWithdrawalFees = (
  paymentMethod?: SBPaymentTypes | 'ALL'
) => ({
  type: AT.FETCH_WITHDRAWAL_FEES,
  payload: { paymentMethod }
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
  withdrawFeesResponse: WithdrawalMinsAndFeesResponse
): WithdrawActionTypes => ({
  type: AT.FETCH_WITHDRAWAL_FEES_SUCCESS,
  payload: {
    withdrawFeesResponse
  }
})

export const fetchWithdrawalLock = (currency?: WalletFiatType) => ({
  type: AT.FETCH_WITHDRAWAL_LOCK,
  currency
})

export const fetchWithdrawalLockFailure = (
  error: string
): WithdrawActionTypes => ({
  type: AT.FETCH_WITHDRAWAL_LOCK_FAILURE,
  payload: {
    error
  }
})

export const fetchWithdrawalLockLoading = (): WithdrawActionTypes => ({
  type: AT.FETCH_WITHDRAWAL_LOCK_LOADING
})

export const fetchWithdrawalLockSuccess = (
  withdrawLockResponse: WithdrawalLockResponseType
): WithdrawActionTypes => ({
  type: AT.FETCH_WITHDRAWAL_LOCK_SUCCESS,
  payload: {
    withdrawLockResponse
  }
})
