// import { ExtractSuccess } from 'core/types'
// import { lift } from 'ramda'

import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.core.data.activity.getCustodialActivity,
    selectors.core.data.activity.getCustodialActivityStatus,
    selectors.core.data.activity.getNonCustodialActivityStatus
  ],
  (activity, status, status2) => {
    console.log(status2)
    return {
      activity,
      status
    }
  }
)
