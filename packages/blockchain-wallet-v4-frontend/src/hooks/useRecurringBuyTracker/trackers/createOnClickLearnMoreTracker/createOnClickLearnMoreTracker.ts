import { actions } from 'data'
import { RecurringBuyOrigins } from 'data/types'

import { RecurringBuyTracker } from '../types'
import { OnClickLearnMoreTracker } from './types'

export const createOnClickLearnMoreTracker: RecurringBuyTracker<OnClickLearnMoreTracker> =
  ({ dispatch }) =>
  () => {
    return dispatch(
      actions.components.recurringBuy.learnMoreLinkClicked(RecurringBuyOrigins.DASHBOARD_PROMO)
    )
  }
