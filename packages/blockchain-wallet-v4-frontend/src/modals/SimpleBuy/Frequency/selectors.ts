import { lift } from 'ramda'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { selectors } from 'data'

const getData = createDeepEqualSelector(
  [
    selectors.components.recurringBuy.getPaymentInfo,
    selectors.components.simpleBuy.getDefaultPaymentMethod
  ],
  (paymentInfoR, defaultMethodR) => {
    return lift(
      (
        paymentInfo: ExtractSuccess<typeof paymentInfoR>,
        defaultMethod: ExtractSuccess<typeof defaultMethodR>
      ) => ({
        defaultMethod,
        paymentInfo
      })
    )(paymentInfoR, defaultMethodR)
  }
)

export default getData
