import {
  compose,
  curry,
  indexOf,
  filter,
  flip,
  head,
  last,
  map,
  sortBy,
  uniq
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
export const NO_VALUE_ERROR = 'No value'
export const REACHED_DAILY_ERROR = 'Reached daily limit'
export const REACHED_WEEKLY_ERROR = 'Reached weekly limit'
export const REACHED_ANNUAL_ERROR = 'Reached annual limit'
export const NO_ADVICE_ERROR = 'No advice present'
export const NO_LIMITS_ERROR = 'No limits present'
export const MINIMUM_ERROR = 'Amount is lower than mimimum'
export const BALANCE_ERROR = 'Insufficient funds'
export const DAILY_ERROR = "You've reached daily trade limit"
export const WEEKLY_ERROR = "You've reached weekly trade limit"
export const ANNUAL_ERROR = "You've reached annual trade limit"
export const ORDER_ERROR = 'Amount exceeds maximum trade size'
export const LATEST_TX_ERROR = 'Unconfirmed tx pending'
export const LATEST_TX_FETCH_FAILED_ERROR = 'Failed to fetch latest tx data'
export const MISSING_DEVICE_ERROR = 'missing_device'
export const NO_TRADE_PERMISSION = 'NO_TRADE_PERMISSION'
export const CREATE_ACCOUNT_ERROR = 'Not enough funds to create new account'
export const NO_ACCOUNT_ERROR = 'Account does not exist'
export const RESERVE_ERROR = 'Reserve exceeds remaining funds'

const currenciesOrder = ['BTC', 'ETH', 'BCH', 'XLM', 'BSV']
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

const getAvailableCoin = headOrLast => availablePairs =>
  compose(
    sortByOrder,
    uniq,
    map(headOrLast),
    map(splitPair)
  )(availablePairs)
export const getAvailableSourceCoins = getAvailableCoin(head)
export const getAvailableTargetCoins = getAvailableCoin(last)
