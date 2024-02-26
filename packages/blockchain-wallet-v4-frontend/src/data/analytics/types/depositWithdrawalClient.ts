// Deposit Withdrawal Client Events
export enum DepositWithdrawalClientEvents {
  DEPOSIT_WITHDRAWAL_CLIENTS_DEPOSIT_AMOUNT_ENTERED = 'Deposit Amount Entered',
  DEPOSIT_WITHDRAWAL_CLIENTS_DEPOSIT_METHOD_SELECTED = 'Deposit Method Selected',
  DEPOSIT_WITHDRAWAL_CLIENTS_WITHDRAWAL_AMOUNT_ENTERED = 'Withdrawal Amount Entered',
  DEPOSIT_WITHDRAWAL_CLIENTS_WITHDRAWAL_AMOUNT_HELPER_CLICKED = 'Withdrawal Amount Helper Clicked',
  DEPOSIT_WITHDRAWAL_CLIENTS_WITHDRAWAL_AMOUNT_MAX_CLICKED = 'Withdrawal Amount Max Clicked',
  DEPOSIT_WITHDRAWAL_CLIENTS_WITHDRAWAL_AMOUNT_MIN_CLICKED = 'Withdrawal Amount Min Clicked',
  DEPOSIT_WITHDRAWAL_CLIENTS_WITHDRAWAL_METHOD_SELECTED = 'Withdrawal Method Selected'
}

type DepositMethod = 'BANK_ACCOUNT' | 'BANK_TRANSFER'
type WithdrawalMethod = DepositMethod | 'CRYPTO'
type ToAccountType = 'EXTERNAL' | 'SAVINGS' | 'TRADING' | 'USERKEY'

type DepositAmountEnteredAction = {
  key: DepositWithdrawalClientEvents.DEPOSIT_WITHDRAWAL_CLIENTS_DEPOSIT_AMOUNT_ENTERED
  properties: {
    currency: String
    deposit_method: DepositMethod
    input_amount: Number
    output_amount: Number
  }
}
type DepositMethodSelectedAction = {
  key: DepositWithdrawalClientEvents.DEPOSIT_WITHDRAWAL_CLIENTS_DEPOSIT_METHOD_SELECTED
  properties: {
    currency: String
    deposit_method: DepositMethod
  }
}

type WithdrawalAmountEnteredAction = {
  key: DepositWithdrawalClientEvents.DEPOSIT_WITHDRAWAL_CLIENTS_WITHDRAWAL_AMOUNT_ENTERED
  properties: {
    amount: Number
    currency: String
    withdrawal_method: WithdrawalMethod
  }
}

type WithdrawalAmountHelperClickedAction = {
  key: DepositWithdrawalClientEvents.DEPOSIT_WITHDRAWAL_CLIENTS_WITHDRAWAL_AMOUNT_HELPER_CLICKED
  properties: {
    amount_currency: Number
    amount_pct: Number
    currency: String
    withdrawal_method: WithdrawalMethod
  }
}
type WithdrawalAmountMaxClickedAction = {
  key: DepositWithdrawalClientEvents.DEPOSIT_WITHDRAWAL_CLIENTS_WITHDRAWAL_AMOUNT_MAX_CLICKED
  properties: {
    amount_currency: Number
    currency: String
    withdrawal_method: WithdrawalMethod
  }
}
type WithdrawalAmountMinClickedAction = {
  key: DepositWithdrawalClientEvents.DEPOSIT_WITHDRAWAL_CLIENTS_WITHDRAWAL_AMOUNT_MIN_CLICKED
  properties: {
    amount_currency: String
    currency: String
    withdrawal_method: WithdrawalMethod
  }
}
type WithdrawalMethodSelectedAction = {
  key: DepositWithdrawalClientEvents.DEPOSIT_WITHDRAWAL_CLIENTS_WITHDRAWAL_METHOD_SELECTED
  properties: {
    currency: String
    to_account_type: ToAccountType
    withdrawal_method: WithdrawalMethod
  }
}

// track event actions to be used inside codebase when we do trigger event
export type DepositWithdrawalClientEventActions =
  | DepositAmountEnteredAction
  | DepositMethodSelectedAction
  | WithdrawalAmountEnteredAction
  | WithdrawalAmountHelperClickedAction
  | WithdrawalAmountMaxClickedAction
  | WithdrawalAmountMinClickedAction
  | WithdrawalMethodSelectedAction

// shared types
type BasePayload = {
  originalTimestamp: string
}

type ActionsProperties =
  | DepositAmountEnteredAction['properties']
  | DepositMethodSelectedAction['properties']
  | WithdrawalAmountEnteredAction['properties']
  | WithdrawalAmountHelperClickedAction['properties']
  | WithdrawalAmountMaxClickedAction['properties']
  | WithdrawalAmountMinClickedAction['properties']
  | WithdrawalMethodSelectedAction['properties']

// analytics properties to be used for analytics queue typing
export type DepositWithdrawalClientProperties = BasePayload | (BasePayload & ActionsProperties)
