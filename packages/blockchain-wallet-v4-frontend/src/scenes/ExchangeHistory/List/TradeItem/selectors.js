import moment from 'moment'
import { ifElse } from 'ramda'

import { getCoinFromPair } from 'services/ShapeshiftService'
import { model, selectors } from 'data'

const { DATE_FORMAT, isShapeShiftTrade } = model.components.exchangeHistory
const { splitPair } = model.rates

const formatExchangeTrade = ({
  state,
  pair,
  createdAt,
  depositQuantity,
  withdrawalQuantity
}) => {
  const [sourceCoin, targetCoin] = splitPair(pair)

  return {
    status: state,
    date: moment(createdAt).format(DATE_FORMAT),
    sourceCoin,
    targetCoin,
    depositAmount: depositQuantity,
    withdrawalAmount: withdrawalQuantity
  }
}

const formatShapeshiftTrade = trade => {
  const { status, timestamp, quote } = trade
  const { pair, depositAmount, withdrawalAmount, deposit } = quote
  const { sourceCoin, targetCoin } = getCoinFromPair(pair)

  return {
    status,
    date: moment(timestamp).format(DATE_FORMAT),
    sourceCoin,
    targetCoin,
    deposit,
    depositAmount,
    withdrawalAmount
  }
}

export const formatTrade = ifElse(
  isShapeShiftTrade,
  formatShapeshiftTrade,
  formatExchangeTrade
)

export const getData = state => ({
  useShapeShift: selectors.components.exchange.useShapeShift(state)
})
