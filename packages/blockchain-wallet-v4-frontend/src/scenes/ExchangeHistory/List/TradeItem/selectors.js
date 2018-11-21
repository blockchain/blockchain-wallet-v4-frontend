import moment from 'moment'
import { ifElse } from 'ramda'

import { getCoinFromPair } from 'services/ShapeshiftService'
import { model } from 'data'

const {
  DATE_FORMAT,
  formatExchangeTrade,
  isShapeShiftTrade
} = model.components.exchangeHistory

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
    withdrawalAmount,
    isShapeShiftTrade: true
  }
}

export const formatTrade = ifElse(
  isShapeShiftTrade,
  formatShapeshiftTrade,
  formatExchangeTrade
)
