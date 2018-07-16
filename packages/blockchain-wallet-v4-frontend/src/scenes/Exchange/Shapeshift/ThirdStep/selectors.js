import { selectors } from 'data'
import { prop } from 'ramda'
import { getCoinFromPair } from 'services/ShapeshiftService'

export const getData = state => {
  const order = selectors.components.exchange.getOrder(state)
  const depositAddress = prop('deposit', order)
  const tradeR = selectors.core.kvStore.shapeShift.getTrade(depositAddress, state)

  const transform = trade => {
    const quote = prop('quote', trade)
    const pair = prop('pair', quote)
    const { sourceCoin, targetCoin } = getCoinFromPair(pair)

    return {
      sourceCoin,
      targetCoin,
      status: prop('status', trade),
      exchangeRate: prop('quotedRate', quote),
      transactionFee: prop('minerFee', quote),
      orderId: prop('orderId', quote),
      depositAmount: prop('depositAmount', quote),
      withdrawalAmount: prop('withdrawalAmount', quote)
    }
  }

  return tradeR.map(transform)
}
