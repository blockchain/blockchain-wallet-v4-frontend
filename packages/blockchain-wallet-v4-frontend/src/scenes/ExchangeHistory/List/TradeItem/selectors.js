import { ifElse } from 'ramda'

import { getCoinFromPair } from 'services/ShapeshiftService'
import { model } from 'data'

const {
  formatExchangeTrade,
  isShapeShiftTrade
} = model.components.exchangeHistory

const formatShapeshiftTrade = trade => {
  const { status, timestamp, quote } = trade
  const { pair, depositAmount, withdrawalAmount, deposit } = quote
  const { sourceCoin, targetCoin } = getCoinFromPair(pair)

  return {
    status,
    date: timestamp,
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
