import { selectors } from 'data'
import { lift, prop } from 'ramda'
import BigNumber from 'bignumber.js'

export const getData = (state, source, target, balance) => {
  const orderR = selectors.core.data.shapeShift.getOrder(state)

  const transform = (order) => {
    const depositAddress = prop('deposit', order)
    const depositAmount = prop('depositAmount', order)
    const depositFee = prop('fee', balance)
    const depositTotal = new BigNumber(depositAmount).add(new BigNumber(depositFee)).toString()
    const exchangeRate = `1 ${prop('coin', source)} = ${prop('quotedRate', order)} ${prop('coin', target)}`
    const withdrawalAmount = prop('withdrawalAmount', order)
    const withdrawalFee = prop('minerFee', order)
    const expiration = prop('expiration', order)

    return {
      depositAddress,
      depositAmount,
      depositFee,
      depositTotal,
      exchangeRate,
      withdrawalAmount,
      withdrawalFee,
      expiration
    }
  }

  return lift(transform)(orderR)
}
