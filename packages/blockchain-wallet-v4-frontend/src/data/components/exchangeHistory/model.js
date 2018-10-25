import moment from 'moment'
import { difference, has, propOr, values } from 'ramda'

export const PER_PAGE = 20

export const DATE_FORMAT = 'DD MMMM YYYY, HH:mm'

export const RESULTS_MODAL = '@EXCHANGE.RESULTS_MODAL'

export const STATES = {
  PENDING_EXECUTION: 'PENDING_EXECUTION',
  FAILED: 'FAILED',
  PENDING_DEPOSIT: 'PENDING_DEPOSIT',
  EXPIRED: 'EXPIRED',
  FINISHED_DEPOSIT: 'FINISHED_DEPOSIT',
  PENDING_WITHDRAWAL: 'PENDING_WITHDRAWAL',
  PENDING_REFUND: 'PENDING_REFUND',
  REFUNDED: 'REFUNDED',
  FINISHED: 'FINISHED'
}

export const COMPLETE_STATES = [
  STATES.FAILED,
  STATES.EXPIRED,
  STATES.REFUNDED,
  STATES.FINISHED
]

export const INCOMPLETE_STATES = difference(values(STATES), COMPLETE_STATES)

export const isShapeShiftTrade = has('status')

export const formatExchangeTrade = ({
  id,
  state,
  createdAt,
  deposit,
  withdrawal,
  fiatValue,
  withdrawalFee,
  rate,
  refundAmount
}) => {
  return {
    id,
    status: state,
    date: moment(createdAt).format(DATE_FORMAT),
    sourceCoin: propOr('', 'symbol', deposit),
    targetCoin: propOr('', 'symbol', withdrawal),
    depositAmount: propOr('', 'value', deposit),
    withdrawalAmount: propOr('', 'value', withdrawal),
    targetFiat: propOr('', 'value', fiatValue),
    currency: propOr('', 'symbol', fiatValue),
    fee: propOr('', 'value', withdrawalFee),
    rate,
    refundAmount,
    isShapeShiftTrade: false
  }
}
