import * as AT from './actionTypes'
import { WalletFiatType } from 'core/types'
import { WithdrawStepActionsPayload } from './types'

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
