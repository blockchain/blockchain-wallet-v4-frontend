// import { ExtractSuccess } from 'core/types'
// import { lift } from 'ramda'

import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.core.data.activity.getCustodialActivity,
    selectors.core.data.activity.getCustodialActivityStatus
  ],
  (activity, status) => {
    return {
      activity,
      status
    }
  }
)
