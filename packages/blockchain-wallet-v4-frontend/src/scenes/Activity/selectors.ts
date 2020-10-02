// import { ExtractSuccess } from 'core/types'
// import { lift } from 'ramda'

import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.core.data.activity.getAllActivity,
    selectors.core.data.activity.getAllActivityStatus
  ],
  (activity, status) => {
    return {
      activity,
      status
    }
  }
)
