import { lift, prop, path } from 'ramda'
import { selectors } from 'data'

export const getData = (state, address) => {
  const tradeR = selectors.core.kvStore.shapeShift.getTrade(state, address)
  const tradeStatusR = selectors.core.data.shapeShift.getTrade(state, address)

  const transform = (trade, tradeStatus) => ({
    status: prop('status', trade),
    exchangeRate: path(['quote', 'quotedRate'], trade),
    transactionFee: path(['quote', 'minerFee'], trade),
    orderId: path(['quote', 'orderId'], trade),
    incomingAmount: prop('incomingCoin', tradeStatus),
    incomingCoin: prop('incomingType', tradeStatus),
    outgoingAmount: prop('outgoingCoin', tradeStatus),
    outgoingCoin: prop('outgoingType', tradeStatus)
  })

  return lift((trade, tradeStatus) => transform(trade, tradeStatus))(tradeR, tradeStatusR)
}
