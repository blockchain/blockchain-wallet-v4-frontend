import { Remote } from 'blockchain-wallet-v4'

export const EXCHANGE_STEPS = {
  STATE_REGISTRATION: 0,
  EXCHANGE_FORM: 1,
  CONFIRM: 2,
  EXCHANGE_RESULT: 3
}

export const EXCHANGE_FORM = '@EXCHANGE.EXCHANGE_FORM'
export const CONFIRM_FORM = '@EXCHANGE.CONFIRM_FORM'
export const SHAPESHIFT_FORM = '@EXCHANGE.SHAPESHIFT_FORM'

export const SHAPESHIFT_PAIRS = Remote.of([
  'BTC-BCH',
  'BTC-ETH',
  'BCH-BTC',
  'BCH-ETH',
  'ETH-BTC',
  'ETH-BCH'
])

export const NO_ADVICE_ERROR = 'No advice present'
export const NO_LIMITS_ERROR = 'No limits present'
export const MINIMUM_ERROR = 'Amount is lower than mimimum'
export const BALANCE_ERROR = 'Insufficient funds'
export const DAILY_ERROR = "You've reached daily trade limit"
export const WEEKLY_ERROR = "You've reached weekly trade limit"
export const ANNUAL_ERROR = "You've reached annual trade limit"
export const ORDER_ERROR = 'Amount exceeds maximum trade size'
