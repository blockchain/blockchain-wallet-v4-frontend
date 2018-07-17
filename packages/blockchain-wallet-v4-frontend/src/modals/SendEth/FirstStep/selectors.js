import { prop, propOr } from 'ramda'
import { selectors } from 'data'
import { createDeepEqualSelector } from 'services/ReselectHelper'

export const getData = createDeepEqualSelector(
  [selectors.components.sendEth.getPayment],
  paymentR => {
    const transform = payment => {
      const effectiveBalance = propOr('0', 'effectiveBalance', payment)
      const unconfirmedTx = prop('unconfirmedTx', payment)
      const isContract = prop('isContract', payment)
      const fee = propOr('0', 'fee', payment)

      return {
        effectiveBalance,
        unconfirmedTx,
        isContract,
        fee
      }
    }
    return paymentR.map(transform)
  }
)
