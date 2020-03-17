import { difference, has, propOr, values } from 'ramda'

import { splitPair } from 'data/modules/rates/model'

export const PER_PAGE = 20
export const ETH_AIRDROP_MODAL = '@EXCHANGE.ETH_AIRDROP_MODAL'
export const RESULTS_MODAL = '@EXCHANGE.RESULTS_MODAL'

export const STATES = {
  PENDING_EXECUTION: 'PENDING_EXECUTION',
  FAILED: 'FAILED',
  PENDING_DEPOSIT: 'PENDING_DEPOSIT',
  EXPIRED: 'EXPIRED',
  DELAYED: 'DELAYED',
  FINISHED_DEPOSIT: 'FINISHED_DEPOSIT',
  PENDING_WITHDRAWAL: 'PENDING_WITHDRAWAL',
  PENDING_REFUND: 'PENDING_REFUND',
  REFUNDED: 'REFUNDED',
  RETRYING_WITHDRAWAL: 'RETRYING_WITHDRAWAL',
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
  refundAmount,
  pair
}) => {
  const [sourceCoin, targetCoin] = splitPair(pair)
  return {
    id,
    status: state,
    date: createdAt,
    sourceCoin,
    targetCoin,
    depositAmount: propOr('', 'value', deposit),
    withdrawalAmount: propOr(0, 'value', withdrawal),
    targetFiat: propOr('', 'value', fiatValue),
    currency: propOr('', 'symbol', fiatValue),
    fee: propOr('', 'value', withdrawalFee),
    rate,
    refundAmount,
    isShapeShiftTrade: false
  }
}
