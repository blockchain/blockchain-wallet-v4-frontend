import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'

const getData = createDeepEqualSelector(
  [selectors.components.buySell.getBSOrder, selectors.components.recurringBuy.getPaymentInfo],
  (orderR, paymentInfoR) => {
    return lift(
      (order: ExtractSuccess<typeof orderR>, paymentInfo: ExtractSuccess<typeof paymentInfoR>) => ({
        order,
        paymentInfo
      })
    )(orderR, paymentInfoR)
  }
)

export default getData
