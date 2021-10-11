import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
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
