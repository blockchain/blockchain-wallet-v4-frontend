import { WalletFiatType } from 'core/types'

import * as AT from './actionTypes'

// types
export enum WithdrawStepEnum {
  'ENTER_AMOUNT'
}

export type WithdrawStepActionsPayload = {
  fiatCurrency: WalletFiatType
  step: 'ENTER_AMOUNT'
}

// state
export type WithdrawState = {
  fiatCurrency: WalletFiatType
  step: keyof typeof WithdrawStepEnum
}

// actions
interface SetStepAction {
  payload: WithdrawStepActionsPayload
  type: typeof AT.SET_STEP
}

export type WithdrawActionTypes = SetStepAction
