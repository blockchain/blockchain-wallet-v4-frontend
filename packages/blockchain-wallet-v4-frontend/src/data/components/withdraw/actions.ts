import {
  BeneficiaryType,
  CoinType,
  CrossBorderLimits,
  FiatType,
  SBPaymentTypes,
  WalletAcountType,
  WalletFiatType,
  WithdrawalLockResponseType,
  WithdrawalMinsAndFeesResponse
} from '@core/types'
import { BankTransferAccountType } from 'data/types'

import * as AT from './actionTypes'
import { WithdrawActionTypes, WithdrawStepActionsPayload } from './types'

export const handleCustodyWithdraw = (
  amount: string,
  beneficiary: BeneficiaryType | BankTransferAccountType | null,
  fiatCurrency: WalletFiatType
) => ({
  payload: {
    amount,
    beneficiary,
    fiatCurrency
  },
  type: AT.HANDLE_WITHDRAW_SUBMIT
})

export const setStep = (payload: WithdrawStepActionsPayload) => ({
  payload,
  type: AT.SET_STEP
})

export const showModal = (fiatCurrency: WalletFiatType) => ({
  payload: {
    fiatCurrency
  },
  type: AT.SHOW_MODAL
})

export const handleWithdrawMaxAmountClick = (amount: number) => ({
  payload: {
    amount
  },
  type: AT.HANDLE_WITHDRAWAL_MAX_AMOUNT_CLICK
})

export const handleWithdrawMinAmountClick = (amount: number) => ({
  payload: {
    amount
  },
  type: AT.HANDLE_WITHDRAWAL_MIN_AMOUNT_CLICK
})

export const fetchWithdrawalFees = (paymentMethod?: SBPaymentTypes | 'ALL') => ({
  payload: { paymentMethod },
  type: AT.FETCH_WITHDRAWAL_FEES
})

export const fetchWithdrawalFeesFailure = (error: string): WithdrawActionTypes => ({
  payload: {
    error
  },
  type: AT.FETCH_WITHDRAWAL_FEES_FAILURE
})

export const fetchWithdrawalFeesLoading = (): WithdrawActionTypes => ({
  type: AT.FETCH_WITHDRAWAL_FEES_LOADING
})

export const fetchWithdrawalFeesSuccess = (
  withdrawFeesResponse: WithdrawalMinsAndFeesResponse
): WithdrawActionTypes => ({
  payload: {
    withdrawFeesResponse
  },
  type: AT.FETCH_WITHDRAWAL_FEES_SUCCESS
})

export const fetchWithdrawalLock = (currency?: FiatType) => ({
  currency,
  type: AT.FETCH_WITHDRAWAL_LOCK
})

export const fetchWithdrawalLockFailure = (error: string): WithdrawActionTypes => ({
  payload: {
    error
  },
  type: AT.FETCH_WITHDRAWAL_LOCK_FAILURE
})

export const fetchWithdrawalLockLoading = (): WithdrawActionTypes => ({
  type: AT.FETCH_WITHDRAWAL_LOCK_LOADING
})

export const fetchWithdrawalLockSuccess = (
  withdrawLockResponse: WithdrawalLockResponseType
): WithdrawActionTypes => ({
  payload: {
    withdrawLockResponse
  },
  type: AT.FETCH_WITHDRAWAL_LOCK_SUCCESS
})

export const fetchCrossBorderLimits = (
  inputCurrency: CoinType,
  fromAccount: WalletAcountType,
  outputCurrency: CoinType,
  toAccount: WalletAcountType,
  currency?: WalletFiatType
) => ({
  payload: {
    currency,
    fromAccount,
    inputCurrency,
    outputCurrency,
    toAccount
  },
  type: AT.FETCH_WITHDRAWAL_CROSSBORDER_LIMITS
})
export const fetchCrossBorderLimitsFailure = (error: string) => ({
  payload: {
    error
  },
  type: AT.FETCH_WITHDRAWAL_CROSSBORDER_LIMITS_FAILURE
})
export const fetchCrossBorderLimitsLoading = () => ({
  type: AT.FETCH_WITHDRAWAL_CROSSBORDER_LIMITS_LOADING
})
export const fetchCrossBorderLimitsSuccess = (limitsResponse: CrossBorderLimits) => ({
  payload: limitsResponse,
  type: AT.FETCH_WITHDRAWAL_CROSSBORDER_LIMITS_SUCCESS
})
