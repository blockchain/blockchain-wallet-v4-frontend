import { prop, path } from 'ramda'
import { selectors } from 'data'

export const getData = (state) => {
  const depositAddress = selectors.core.data.shapeShift.getOrder(state).map(x => prop('deposit', x)).getOrElse('')
  const tradeR = selectors.core.kvStore.shapeShift.getTrade(depositAddress, state)

  const transform = (trade) => ({
    status: prop('status', trade),
    exchangeRate: path(['quote', 'quotedRate'], trade),
    transactionFee: path(['quote', 'minerFee'], trade),
    orderId: path(['quote', 'orderId'], trade),
    depositAmount: path(['quote', 'depositAmount'], trade),
    withdrawalAmount: path(['quote', 'withdrawalAmount'], trade)
  })

  return tradeR.map(transform)
}
