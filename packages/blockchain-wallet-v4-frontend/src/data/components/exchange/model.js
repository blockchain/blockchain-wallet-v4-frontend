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

export const formatPair = (source, target) => `${source}-${target}`
