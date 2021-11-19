import {
  BeneficiaryType,
  CrossBorderLimits,
  FiatType,
  RemoteDataType,
  WalletFiatType,
  WithdrawalLockResponseType,
  WithdrawalMinsAndFeesResponse,
  WithdrawResponseType
} from '@core/types'

import { BankTransferAccountType } from '../brokerage/types'
import * as AT from './actionTypes'

// types
export type WithdrawCheckoutFormValuesType = {
  amount: string
}

export enum WithdrawStepEnum {
  BANK_PICKER = 'BANK_PICKER',
  CONFIRM_WITHDRAW = 'CONFIRM_WITHDRAW',
  ENTER_AMOUNT = 'ENTER_AMOUNT',
  INELIGIBLE = 'INELIGIBLE',
  LOADING = 'LOADING',
  ON_HOLD = 'ON_HOLD',
  WITHDRAWAL_DETAILS = 'WITHDRAWAL_DETAILS',
  WITHDRAWAL_METHODS = 'WITHDRAWAL_METHODS'
}

export type WithdrawStepActionsPayload =
  | { step: WithdrawStepEnum.LOADING | WithdrawStepEnum.INELIGIBLE | WithdrawStepEnum.ON_HOLD }
  | {
      beneficiary?: BeneficiaryType
      fiatCurrency: WalletFiatType
      step: WithdrawStepEnum.ENTER_AMOUNT
      transferAccount?: BankTransferAccountType
    }
  | {
      fiatCurrency: WalletFiatType
      step: WithdrawStepEnum.BANK_PICKER
    }
  | {
      amount: string
      beneficiary?: BeneficiaryType
      defaultMethod?: BankTransferAccountType
      step: WithdrawStepEnum.CONFIRM_WITHDRAW
    }
  | {
      step: WithdrawStepEnum.WITHDRAWAL_DETAILS
      withdrawal: WithdrawResponseType
    }
  | {
      fiatCurrency: WalletFiatType
      step: WithdrawStepEnum.WITHDRAWAL_METHODS
    }

// state
export type WithdrawState = {
  amount?: string
  beneficiary?: BeneficiaryType
  crossBorderLimits: RemoteDataType<string, CrossBorderLimits>
  feesAndMinAmount: RemoteDataType<string, WithdrawalMinsAndFeesResponse>
  fiatCurrency: WalletFiatType
  step: WithdrawStepEnum
  withdrawLocks: RemoteDataType<string, WithdrawalLockResponseType>
  withdrawal?: WithdrawResponseType
}

// actions
interface SetStepAction {
  payload: WithdrawStepActionsPayload
  type: typeof AT.SET_STEP
}
interface FetchWithdrawalFeesFailure {
  payload: {
    error: string
  }
  type: typeof AT.FETCH_WITHDRAWAL_FEES_FAILURE
}
interface FetchWithdrawalFeesLoading {
  type: typeof AT.FETCH_WITHDRAWAL_FEES_LOADING
}
interface FetchWithdrawalFeesSuccess {
  payload: {
    withdrawFeesResponse: WithdrawalMinsAndFeesResponse
  }
  type: typeof AT.FETCH_WITHDRAWAL_FEES_SUCCESS
}

interface FetchWithdrawalLockFailure {
  payload: {
    error: string
  }
  type: typeof AT.FETCH_WITHDRAWAL_LOCK_FAILURE
}
interface FetchWithdrawalLockLoading {
  type: typeof AT.FETCH_WITHDRAWAL_LOCK_LOADING
}
interface FetchWithdrawalLockSuccess {
  payload: {
    withdrawLockResponse: WithdrawalLockResponseType
  }
  type: typeof AT.FETCH_WITHDRAWAL_LOCK_SUCCESS
}

interface FetchCrossBorderLimitFailure {
  payload: {
    error: string
  }
  type: typeof AT.FETCH_WITHDRAWAL_CROSSBORDER_LIMITS_FAILURE
}
interface FetchCrossBorderLimitLoading {
  type: typeof AT.FETCH_WITHDRAWAL_CROSSBORDER_LIMITS_LOADING
}
interface FetchCrossBorderLimitSuccess {
  payload: CrossBorderLimits
  type: typeof AT.FETCH_WITHDRAWAL_CROSSBORDER_LIMITS_SUCCESS
}

export type WithdrawActionTypes =
  | SetStepAction
  | FetchWithdrawalFeesFailure
  | FetchWithdrawalFeesSuccess
  | FetchWithdrawalFeesLoading
  | FetchWithdrawalLockFailure
  | FetchWithdrawalLockLoading
  | FetchWithdrawalLockSuccess
  | FetchCrossBorderLimitFailure
  | FetchCrossBorderLimitLoading
  | FetchCrossBorderLimitSuccess

type LimitItem = {
  available: string
  limit: string
  used: string
}

export type WithdrawLimitsResponse = {
  cryptoLimit: {
    available: string
    daily: LimitItem
    monthly: LimitItem
    suggestedUpgrade: {
      daily: LimitItem
      monthly: LimitItem
      requiredTier: number
      requirements: string[]
    }
  }
  currency: FiatType
  fiatLimit: {
    available: string
    suggestedUpgrade: {
      daily: LimitItem
      monthly: LimitItem
      requiredTier: number
      requirements: string[]
    }
  }
  userId: string
}
