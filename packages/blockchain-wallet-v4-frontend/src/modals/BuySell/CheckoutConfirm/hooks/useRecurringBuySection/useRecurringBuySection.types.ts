import { BSPaymentTypes } from '@core/types'
import { RecurringBuyPeriods } from 'data/types'

export type RecurringBuySectionHookProps = {
  initialPeriod: RecurringBuyPeriods | undefined
  paymentType: BSPaymentTypes | undefined
}

export type RecurringBuySectionHook = (props: RecurringBuySectionHookProps) => {
  setPeriod: (period: RecurringBuyPeriods) => void
  showRecurringBuySection: boolean
}
