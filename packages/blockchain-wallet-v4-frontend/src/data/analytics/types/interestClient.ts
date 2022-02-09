// Interest Client Events
export enum Events {
  INTEREST_CLIENT_DEPOSIT_AMOUNT_ENTERED = 'Interest Deposit Amount Entered',
  INTEREST_CLIENT_DEPOSIT_MAX_AMOUNT_CLICKED = 'Interest Deposit Max Amount Clicked',
  INTEREST_CLIENT_DEPOSIT_MIN_AMOUNT_CLICKED = 'Interest Deposit Min Amount Clicked',
  INTEREST_CLIENT_SUBMIT_INFORMATION_CLICKED = 'Interest Submit Information Clicked'
}

type AccountType = 'TRADING' | 'USERKEY'

type DepositAmountEnteredAction = {
  key: Events.INTEREST_CLIENT_DEPOSIT_AMOUNT_ENTERED
  properties: {
    amount: Number
    amount_currency: String
    currency: String
    from_account_type: AccountType
    input_amount: Number
    interest_rate: Number
    output_amount: Number
  }
}
type DepositMaxAmountClickedAction = {
  key: Events.INTEREST_CLIENT_DEPOSIT_MAX_AMOUNT_CLICKED
  properties: {
    amount_currency: String
    currency: String
    from_account_type: AccountType
  }
}
type DepositMinAmountClickedAction = {
  key: Events.INTEREST_CLIENT_DEPOSIT_MIN_AMOUNT_CLICKED
  properties: {
    amount_currency: String
    currency: String
    from_account_type: AccountType
  }
}
type ClientSubmitInformationClickedAction = {
  key: Events.INTEREST_CLIENT_SUBMIT_INFORMATION_CLICKED
  properties: {}
}

// track event actions to be used inside codebase when we do trigger event
export type TrackEventAction =
  | DepositAmountEnteredAction
  | DepositMaxAmountClickedAction
  | DepositMinAmountClickedAction
  | ClientSubmitInformationClickedAction

// shared types
type BasePayload = {
  originalTimestamp: string
}
type DepositAmountEnteredProperties = BasePayload & {
  amount: Number
  amount_currency: String
  currency: String
  from_account_type: AccountType
  input_amount: Number
  interest_rate: Number
  output_amount: Number
}
type DepositMaxAmountClickedProperties = BasePayload & {
  amount_currency: String
  currency: String
  from_account_type: AccountType
}
type DepositMinAmountClickedProperties = BasePayload & {
  amount_currency: String
  currency: String
  from_account_type: AccountType
}
// nothing to be passed beside base properties
type ClientSubmitInformationClickedProperties = BasePayload

// analytics properties to be used for analytics queue typing
export type AnalyticsProperties =
  | BasePayload
  | DepositAmountEnteredProperties
  | DepositMaxAmountClickedProperties
  | DepositMinAmountClickedProperties
  | ClientSubmitInformationClickedProperties
