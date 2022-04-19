import { useDispatch } from 'react-redux'

import { createOnClickLearnMoreTracker } from './trackers'
import { RecurringBuyTrackerProps } from './trackers/types'
import { RecurringBuyTrackerHook } from './types'

export const useRecurringBuyTracker: RecurringBuyTrackerHook = () => {
  const dispatch = useDispatch()

  const trackerProps: RecurringBuyTrackerProps = {
    dispatch
  }

  return {
    trackOnClickLearnMore: createOnClickLearnMoreTracker(trackerProps)
  }
}
