import * as AT from './actionTypes'
import { BeneficiaryType, WalletFiatType } from 'core/types'
import { WithdrawStepActionsPayload } from './types'

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
