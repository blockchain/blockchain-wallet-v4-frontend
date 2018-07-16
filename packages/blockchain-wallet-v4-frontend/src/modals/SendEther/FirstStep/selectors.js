import { prop } from 'ramda'
import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [
    selectors.components.sendEth.getPayment
  ],
  (paymentR) => {
    const transform = payment => {
      const effectiveBalance = prop('effectiveBalance', payment) || '0'
      const unconfirmedTx = prop('unconfirmedTx', payment)
      const fee = prop('fee', payment) || '0'

      return {
        effectiveBalance,
        unconfirmedTx,
        fee
      }
    }
    return paymentR.map(transform)
  }
)
