import { lift } from 'ramda'

import { ExtractSuccess } from '@core/types'
import { createDeepEqualSelector } from '@core/utils'
import { selectors } from 'data'

const getData = createDeepEqualSelector(
  [selectors.components.withdraw.getWithdrawalLocks],
  (withdrawalLocksR) => {
    const transform = (withdrawalLocks: ExtractSuccess<typeof withdrawalLocksR>) => {
      return {
        withdrawalLocks
      }
    }

    return lift(transform)(withdrawalLocksR)
  }
)

export default getData
