/* eslint-disable @typescript-eslint/no-unused-vars */
import { createSlice, PayloadAction } from '@reduxjs/toolkit'

import Remote from '@core/remote'
import {
  BeneficiaryType,
  BSPaymentTypes,
  CrossBorderLimits,
  CrossBorderLimitsPayload,
  FiatType,
  WalletFiatType,
  WithdrawalLockResponseType,
  WithdrawalMinsAndFeesResponse
} from '@core/types'
import { BankTransferAccountType } from 'data/types'

import { WithdrawState, WithdrawStepActionsPayload, WithdrawStepEnum } from './types'

const initialState: WithdrawState = {
  amount: undefined,
  beneficiary: undefined,
  crossBorderLimits: Remote.NotAsked,
  feesAndMinAmount: Remote.NotAsked,
  fiatCurrency: 'EUR',
  step: WithdrawStepEnum.ENTER_AMOUNT,
  withdrawLocks: Remote.NotAsked,
  withdrawal: undefined
}

const withdrawSlice = createSlice({
  initialState,
  name: 'withdraw',
  reducers: {
    // cross border limits
    fetchCrossBorderLimits: (state, action: PayloadAction<CrossBorderLimitsPayload>) => {},
    fetchCrossBorderLimitsFailure: (state, action: PayloadAction<string>) => {
      state.crossBorderLimits = Remote.Failure(action.payload)
    },
    fetchCrossBorderLimitsLoading: (state) => {
      state.crossBorderLimits = Remote.Loading
    },
    fetchCrossBorderLimitsSuccess: (state, action: PayloadAction<CrossBorderLimits>) => {
      state.crossBorderLimits = Remote.Success(action.payload)
    },

    fetchWithdrawalFees: (
      state,
      action: PayloadAction<{ paymentMethod?: BSPaymentTypes | 'ALL' }>
    ) => {},
    fetchWithdrawalFeesFailure: (state, action: PayloadAction<string>) => {
      state.feesAndMinAmount = Remote.Failure(action.payload)
    },
    fetchWithdrawalFeesLoading: (state) => {
      state.feesAndMinAmount = Remote.Loading
    },
    fetchWithdrawalFeesSuccess: (state, action: PayloadAction<WithdrawalMinsAndFeesResponse>) => {
      state.feesAndMinAmount = Remote.Success(action.payload)
    },

    fetchWithdrawalLock: (state, action: PayloadAction<{ currency?: FiatType }>) => {},
    fetchWithdrawalLockFailure: (state, action: PayloadAction<string>) => {
      state.withdrawLocks = Remote.Failure(action.payload)
    },
    fetchWithdrawalLockLoading: (state) => {
      state.withdrawLocks = Remote.Loading
    },
    fetchWithdrawalLockSuccess: (state, action: PayloadAction<WithdrawalLockResponseType>) => {
      state.withdrawLocks = Remote.Success(action.payload)
    },

    handleCustodyWithdraw: (
      state,
      action: PayloadAction<{
        amount: string
        beneficiary: BeneficiaryType | BankTransferAccountType | null
        fiatCurrency: WalletFiatType
      }>
    ) => {},
    handleWithdrawMaxAmountClick: (state, action: PayloadAction<{ amount: number }>) => {},
    handleWithdrawMinAmountClick: (state, action: PayloadAction<{ amount: number }>) => {},

    setStep: (state, action: PayloadAction<WithdrawStepActionsPayload>) => {
      switch (action.payload.step) {
        case WithdrawStepEnum.ENTER_AMOUNT:
          state.beneficiary = action.payload.beneficiary
          state.fiatCurrency = action.payload.fiatCurrency
          state.step = action.payload.step
          break
        case WithdrawStepEnum.WITHDRAWAL_METHODS:
        case WithdrawStepEnum.BANK_PICKER:
          state.fiatCurrency = action.payload.fiatCurrency
          state.step = action.payload.step
          break
        case WithdrawStepEnum.CONFIRM_WITHDRAW: {
          state.amount = action.payload.amount
          state.beneficiary = action.payload.beneficiary
          state.step = action.payload.step
          break
        }
        case WithdrawStepEnum.WITHDRAWAL_DETAILS: {
          state.withdrawal = action.payload.withdrawal
          state.step = action.payload.step
          break
        }
        default:
          state.step = action.payload.step
          break
      }
    },
    showModal: (
      state,
      action: PayloadAction<{
        fiatCurrency: WalletFiatType
      }>
    ) => {}
  }
})

const { actions, reducer } = withdrawSlice
const withdrawReducer = reducer
export { actions, withdrawReducer }
