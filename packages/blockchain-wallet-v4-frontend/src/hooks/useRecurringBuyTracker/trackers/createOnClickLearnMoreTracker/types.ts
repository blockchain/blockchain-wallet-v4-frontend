import { RecurringBuyOrigins } from 'data/types'

export type OnClickLearnMoreTrackerProps = {
  origin: keyof typeof RecurringBuyOrigins
}

export type OnClickLearnMoreTracker = (props: OnClickLearnMoreTrackerProps) => void
