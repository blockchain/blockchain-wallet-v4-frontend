import { InjectedFormProps } from 'redux-form'

export type WireBankFormType = {
  acceptDetails: boolean
  accountNumber: string
  bankName: string
  hasIntermediaryBank: 'YES' | 'NO'
  intermediaryAccountNumber: string
  intermediaryBankName: string
  intermediaryRoutingNumber: string
  routingNumber: string
}

export type ADD_WIRE_BANK_STEPS =
  | 'USER_INFO'
  | 'INTERMEDIARY_INFO'
  | 'CONFIRM_DATA'
  | 'SUCCESS'
  | 'FAILURE'
  | 'LOADING'

export type StepProps = {
  onClickBack: () => void
  onNextStep: () => void
}

export type StepFormProps = InjectedFormProps<{}, StepProps> & StepProps
