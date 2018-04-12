import { selectors } from 'data'
import { prop } from 'ramda'

export const getData = (state, source, target, fee) => {
  const orderR = selectors.core.data.shapeShift.getOrder(state)

  const transform = (order) => {
    const depositAmount = prop('depositAmount', order)

    return {
      order,
      depositAddress: prop('deposit', order),
      depositAmount,
      exchangeRate: `1 ${prop('coin', source)} = ${prop('quotedRate', order)} ${prop('coin', target)}`,
      withdrawalAmount: prop('withdrawalAmount', order),
      withdrawalFee: prop('minerFee', order),
      expiration: prop('expiration', order)
    }
  }

  return orderR.map(transform)
}
