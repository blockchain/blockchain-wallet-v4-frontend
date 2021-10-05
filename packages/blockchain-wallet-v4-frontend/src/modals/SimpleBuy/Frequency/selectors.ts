import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
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
