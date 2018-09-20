import {
  compose,
  curry,
  indexOf,
  filter,
  flip,
  head,
  last,
  map,
  sortBy
} from 'ramda'

import { Remote } from 'blockchain-wallet-v4'
import { splitPair } from 'data/modules/rates/model'

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

export const MINIMUM_NO_LINK_ERROR =
  'Amount is lower than mimimum. Trade Impossible'
export const MAXIMUM_NO_LINK_ERROR =
  'Amount is higher than maximum. Trade Impossible'
export const NO_ADVICE_ERROR = 'No advice present'
export const NO_LIMITS_ERROR = 'No limits present'
export const MINIMUM_ERROR = 'Amount is lower than mimimum'
export const BALANCE_ERROR = 'Insufficient funds'
export const DAILY_ERROR = "You've reached daily trade limit"
export const WEEKLY_ERROR = "You've reached weekly trade limit"
export const ANNUAL_ERROR = "You've reached annual trade limit"
export const ORDER_ERROR = 'Amount exceeds maximum trade size'

const currenciesOrder = ['BTC', 'BCH', 'ETH']
export const sortByOrder = sortBy(flip(indexOf)(currenciesOrder))

const getPairedCoins = curry(
  (getPaired, getOriginal, originalCoin, availablePairs) =>
    compose(
      sortByOrder,
      map(getPaired),
      filter(pair => getOriginal(pair) === originalCoin),
      map(splitPair)
    )(availablePairs)
)
export const getTargetCoinsPairedToSource = getPairedCoins(last, head)
export const getSourceCoinsPairedToTarget = getPairedCoins(head, last)
