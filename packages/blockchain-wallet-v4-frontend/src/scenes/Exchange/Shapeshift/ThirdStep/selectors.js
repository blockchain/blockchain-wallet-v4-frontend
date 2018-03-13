import { prop, path } from 'ramda'
import { selectors } from 'data'

export const getData = (state, sourceCoin, targetCoin, sourceAmount, targetAmount) => {
  const depositAddress = selectors.core.data.shapeShift.getOrder(state).map(x => prop('deposit', x)).getOrElse('')
  const tradeR = selectors.core.kvStore.shapeShift.getTrade(state, depositAddress)

  const transform = (trade, tradeStatus) => ({
    status: prop('status', trade),
    exchangeRate: path(['quote', 'quotedRate'], trade),
    transactionFee: path(['quote', 'minerFee'], trade),
    orderId: path(['quote', 'orderId'], trade),
    incomingAmount: sourceAmount,
    incomingType: sourceCoin,
    outgoingCoin: targetAmount,
    outgoingType: targetCoin
  })

  return tradeR.map(transform)
}
