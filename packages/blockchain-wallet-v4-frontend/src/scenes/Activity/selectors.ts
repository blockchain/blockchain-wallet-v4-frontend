import { createDeepEqualSelector } from 'services/ReselectHelper'
import { selectors } from 'data'

export const getData = createDeepEqualSelector(
  [
    selectors.core.data.activity.getAllActivity,
    selectors.core.data.activity.getAllActivityStatus,
    selectors.core.data.activity.getNextActivity,
    selectors.core.settings.getCurrency
  ],
  (activity, status, next, currencyR) => {
    const currency = currencyR.getOrElse('USD')
    return {
      activity,
      currency,
      next,
      status
    }
  }
)
