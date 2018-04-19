import { prop } from 'ramda'
import { selectors } from 'data'

export const getData = state => {
  const paymentR = selectors.components.sendEth.getPayment(state)

  const transform = payment => {
    const effectiveBalance = prop('effectiveBalance', payment) || 0
    const fee = prop('fee', payment) || 0

    return {
      effectiveBalance,
      fee
    }
  }

  return paymentR.map(transform)
}
