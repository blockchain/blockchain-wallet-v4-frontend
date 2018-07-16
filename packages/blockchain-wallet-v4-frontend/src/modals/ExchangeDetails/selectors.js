import { selectors } from 'data'
import { getCoinFromPair } from 'services/ShapeshiftService'

export const getData = (depositAddress, state) => {
  const tradeR = selectors.core.kvStore.shapeShift.getTrade(depositAddress, state)

  const transform = trade => {
    const { status, quote } = trade
    const { pair, quotedRate, minerFee, orderId, depositAmount, withdrawalAmount } = quote
    const { sourceCoin, targetCoin } = getCoinFromPair(pair)

    return {
      sourceCoin,
      targetCoin,
      status,
      quotedRate,
      minerFee,
      orderId,
      depositAmount,
      withdrawalAmount
    }
  }

  return tradeR.map(transform)
}
