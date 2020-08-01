import { BeneficiaryType, WalletFiatType } from 'core/types'

import * as AT from './actionTypes'

// types
export type WithdrawCheckoutFormValuesType = {
  amount: string
}

export enum WithdrawStepEnum {
  'ENTER_AMOUNT',
  'BANK_PICKER',
  'CONFIRM_WITHDRAW'
}

export type WithdrawStepActionsPayload =
  | {
      fiatCurrency: WalletFiatType
      step: 'ENTER_AMOUNT' | 'BANK_PICKER'
    }
  | {
      amount: string
      beneficiary: BeneficiaryType
      step: 'CONFIRM_WITHDRAW'
    }

// state
export type WithdrawState = {
  amount?: string
  beneficiary?: BeneficiaryType
  fiatCurrency: WalletFiatType
  step: keyof typeof WithdrawStepEnum
}

// actions
interface SetStepAction {
  payload: WithdrawStepActionsPayload
  type: typeof AT.SET_STEP
}

export type WithdrawActionTypes = SetStepAction
