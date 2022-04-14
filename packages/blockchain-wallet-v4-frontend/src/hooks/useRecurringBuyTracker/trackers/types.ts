import { Dispatch } from 'redux'

export type RecurringBuyTrackerProps = {
  dispatch: Dispatch
}

export type RecurringBuyTracker<T> = (props: RecurringBuyTrackerProps) => T
