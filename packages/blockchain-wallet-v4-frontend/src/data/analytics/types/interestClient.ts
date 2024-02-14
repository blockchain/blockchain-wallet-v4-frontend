// Interest Client Events
export enum Events {
  ACTIVE_REWARDS_CLIENT_DEPOSIT_AMOUNT_ENTERED = 'Active Rewards Deposit Amount Entered',
  ACTIVE_REWARDS_CLIENT_DEPOSIT_MAX_AMOUNT_CLICKED = 'Active Rewards Deposit Max Amount Clicked',
  ACTIVE_REWARDS_CLIENT_DEPOSIT_MIN_AMOUNT_CLICKED = 'Active Rewards Deposit Min Amount Clicked',
  ACTIVE_REWARDS_CLIENT_SUBMIT_INFORMATION_CLICKED = 'Active Rewards Submit Information Clicked',
  INTEREST_CLIENT_DEPOSIT_AMOUNT_ENTERED = 'Interest Deposit Amount Entered',
  INTEREST_CLIENT_DEPOSIT_MAX_AMOUNT_CLICKED = 'Interest Deposit Max Amount Clicked',
  INTEREST_CLIENT_DEPOSIT_MIN_AMOUNT_CLICKED = 'Interest Deposit Min Amount Clicked',
  INTEREST_CLIENT_SUBMIT_INFORMATION_CLICKED = 'Interest Submit Information Clicked',
  STAKING_CLIENT_DEPOSIT_AMOUNT_ENTERED = 'Staking Deposit Amount Entered',
  STAKING_CLIENT_DEPOSIT_MAX_AMOUNT_CLICKED = 'Staking Deposit Max Amount Clicked',
  STAKING_CLIENT_DEPOSIT_MIN_AMOUNT_CLICKED = 'Staking Deposit Min Amount Clicked',
  STAKING_CLIENT_SUBMIT_INFORMATION_CLICKED = 'Staking Submit Information Clicked'
}

type AccountType = 'TRADING' | 'USERKEY'

type DepositAmountEnteredAction = {
  key:
    | Events.ACTIVE_REWARDS_CLIENT_DEPOSIT_AMOUNT_ENTERED
    | Events.INTEREST_CLIENT_DEPOSIT_AMOUNT_ENTERED
    | Events.STAKING_CLIENT_DEPOSIT_AMOUNT_ENTERED
  properties: {
    amount: number
    amount_currency: string
    currency: string
    from_account_type: AccountType
    input_amount: number
    interest_rate?: number
    output_amount?: number
    rate?: number
  }
}
type DepositMinMaxAmountClickedAction = {
  key:
    | Events.ACTIVE_REWARDS_CLIENT_DEPOSIT_MAX_AMOUNT_CLICKED
    | Events.INTEREST_CLIENT_DEPOSIT_MAX_AMOUNT_CLICKED
    | Events.STAKING_CLIENT_DEPOSIT_MAX_AMOUNT_CLICKED
    | Events.ACTIVE_REWARDS_CLIENT_DEPOSIT_MIN_AMOUNT_CLICKED
    | Events.INTEREST_CLIENT_DEPOSIT_MIN_AMOUNT_CLICKED
    | Events.STAKING_CLIENT_DEPOSIT_MIN_AMOUNT_CLICKED
  properties: {
    amount_currency: string
    currency: string
    from_account_type: AccountType
  }
}

type ClientSubmitInformationClickedAction = {
  key:
    | Events.ACTIVE_REWARDS_CLIENT_SUBMIT_INFORMATION_CLICKED
    | Events.INTEREST_CLIENT_SUBMIT_INFORMATION_CLICKED
    | Events.STAKING_CLIENT_SUBMIT_INFORMATION_CLICKED
  properties: {}
}

// track event actions to be used inside codebase when we do trigger event
export type TrackEventAction =
  | DepositAmountEnteredAction
  | DepositMinMaxAmountClickedAction
  | ClientSubmitInformationClickedAction

// shared types
type BasePayload = {
  originalTimestamp: string
}
type DepositAmountEnteredProperties = BasePayload & {
  amount: number
  amount_currency: string
  currency: string
  from_account_type: AccountType
  input_amount: number
  interest_rate: number
  output_amount: number
}
type DepositMaxAmountClickedProperties = BasePayload & {
  amount_currency: string
  currency: string
  from_account_type: AccountType
}
type DepositMinAmountClickedProperties = BasePayload & {
  amount_currency: string
  currency: string
  from_account_type: AccountType
}
// nothing to be passed beside base properties
type ClientSubmitInformationClickedProperties = BasePayload

// analytics properties to be used for analytics queue typing
export type AnalyticsProperties =
  | BasePayload
  | ClientSubmitInformationClickedProperties
  | DepositAmountEnteredProperties
  | DepositMaxAmountClickedProperties
  | DepositMinAmountClickedProperties
