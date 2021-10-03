import { lift } from 'ramda'

import { ExtractSuccess } from 'blockchain-wallet-v4/src/types'
import { createDeepEqualSelector } from 'blockchain-wallet-v4/src/utils'
import { selectors } from 'data'

const getData = createDeepEqualSelector(
  [selectors.components.recurringBuy.getPaymentInfo],
  (paymentInfoR) => {
    return lift((paymentInfo: ExtractSuccess<typeof paymentInfoR>) => ({
      paymentInfo
    }))(paymentInfoR)
  }
)

export default getData
