import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.core.data.activity.getAllActivity,
    selectors.core.data.activity.getAllActivityStatus,
    selectors.core.settings.getCurrency
  ],
  (activity, status, currency) => {
    return {
      activity,
      currency,
      status
    }
  }
)
