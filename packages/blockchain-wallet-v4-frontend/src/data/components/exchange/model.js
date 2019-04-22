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

import { splitPair } from 'data/modules/rates/model'

export const EXCHANGE_FORM = '@EXCHANGE.EXCHANGE_FORM'
export const CONFIRM_FORM = '@EXCHANGE.CONFIRM_FORM'
export const CONFIRM_MODAL = '@EXCHANGE.CONFIRM_MODAL'

export const MINIMUM_NO_LINK_ERROR =
  'Amount is lower than minimum. Trade Impossible'
export const NO_VALUE_ERROR = 'No value'
export const REACHED_DAILY_ERROR = 'Reached daily limit'
export const REACHED_WEEKLY_ERROR = 'Reached weekly limit'
export const REACHED_ANNUAL_ERROR = 'Reached annual limit'
export const NO_ADVICE_ERROR = 'No advice present'
export const NO_LIMITS_ERROR = 'No limits present'
export const MINIMUM_ERROR = 'Amount is lower than minimum'
export const BALANCE_ERROR = 'Insufficient funds'
export const DAILY_ERROR = "You've reached daily trade limit"
export const WEEKLY_ERROR = "You've reached weekly trade limit"
export const ANNUAL_ERROR = "You've reached annual trade limit"
export const ORDER_ERROR = 'Amount exceeds maximum trade size'
export const LATEST_TX_ERROR = 'Unconfirmed tx pending'
export const LATEST_TX_FETCH_FAILED_ERROR = 'Failed to fetch latest tx data'
export const MISSING_DEVICE_ERROR = 'missing_device'
export const CREATE_ACCOUNT_ERROR = 'Not enough funds to create new account'
export const NO_ACCOUNT_ERROR = 'Account does not exist'
export const RESERVE_ERROR = 'Reserve exceeds remaining funds'
export const NO_TRADE_PERMISSION = 'NO_TRADE_PERMISSION'
export const ORDER_BELOW_MIN_LIMIT = 'ORDER_BELOW_MIN_LIMIT'
export const ORDER_ABOVE_MAX_LIMIT = 'ORDER_ABOVE_MAX_LIMIT'
export const DAILY_LIMIT_EXCEEDED = 'DAILY_LIMIT_EXCEEDED'
export const WEEKLY_LIMIT_EXCEEDED = 'WEEKLY_LIMIT_EXCEEDED'
export const ANNUAL_LIMIT_EXCEEDED = 'ANNUAL_LIMIT_EXCEEDED'
export const INSUFFICIENT_ETH_FOR_TX_FEE = 'INSUFFICIENT_ETH_FOR_TX_FEE'

export const SWAP_ERROR_CODES = {
  41: ORDER_BELOW_MIN_LIMIT,
  43: ORDER_ABOVE_MAX_LIMIT,
  45: DAILY_LIMIT_EXCEEDED,
  46: WEEKLY_LIMIT_EXCEEDED,
  47: ANNUAL_LIMIT_EXCEEDED
}

const currenciesOrder = ['BTC', 'PAX', 'ETH', 'BCH', 'XLM', 'BSV']
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
