import moment from 'moment'
import { getCoinFromPair } from 'services/ShapeshiftService'

export const getData = (trade, state) => {
  const { status, timestamp, quote } = trade
  const { pair, depositAmount, withdrawalAmount, deposit } = quote
  const { sourceCoin, targetCoin } = getCoinFromPair(pair)

  return {
    status,
    date: moment(timestamp).format('DD MMMM YYYY, HH:mm'),
    sourceCoin,
    targetCoin,
    deposit,
    depositAmount,
    withdrawalAmount
  }
}
