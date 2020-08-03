import {
  BeneficiaryType,
  WalletFiatType,
  WithdrawResponseType
} from 'core/types'

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
  fiatCurrency: WalletFiatType
  step: keyof typeof WithdrawStepEnum
  withdrawal?: WithdrawResponseType
}

// actions
interface SetStepAction {
  payload: WithdrawStepActionsPayload
  type: typeof AT.SET_STEP
}

export type WithdrawActionTypes = SetStepAction
