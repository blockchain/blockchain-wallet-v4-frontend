import {
  BeneficiaryType,
  RemoteDataType,
  WalletFiatType,
  WithdrawalLockResponseType,
  WithdrawalMinsAndFeesResponse,
  WithdrawResponseType
} from 'blockchain-wallet-v4/src/types'

import * as AT from './actionTypes'

// types
export type WithdrawCheckoutFormValuesType = {
  amount: string
}

export enum WithdrawStepEnum {
  'ENTER_AMOUNT',
  'BANK_PICKER',
  'CONFIRM_WITHDRAW',
  'WITHDRAWAL_DETAILS'
}

export type WithdrawStepActionsPayload =
  | {
      beneficiary?: BeneficiaryType
      fiatCurrency: WalletFiatType
      step: 'ENTER_AMOUNT'
    }
  | {
      fiatCurrency: WalletFiatType
      step: 'BANK_PICKER'
    }
  | {
      amount: string
      beneficiary: BeneficiaryType
      step: 'CONFIRM_WITHDRAW'
    }
  | {
      step: 'WITHDRAWAL_DETAILS'
      withdrawal: WithdrawResponseType
    }

// state
export type WithdrawState = {
  amount?: string
  beneficiary?: BeneficiaryType
  feesAndMinAmount: RemoteDataType<string, WithdrawalMinsAndFeesResponse>
  fiatCurrency: WalletFiatType
  step: keyof typeof WithdrawStepEnum
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

export type WithdrawActionTypes =
  | SetStepAction
  | FetchWithdrawalFeesFailure
  | FetchWithdrawalFeesSuccess
  | FetchWithdrawalFeesLoading
  | FetchWithdrawalLockFailure
  | FetchWithdrawalLockLoading
  | FetchWithdrawalLockSuccess
