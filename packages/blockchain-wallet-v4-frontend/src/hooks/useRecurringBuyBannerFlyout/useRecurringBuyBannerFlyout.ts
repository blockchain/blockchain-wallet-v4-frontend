import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { actions } from 'data'
import { RecurringBuyOrigins } from 'data/types'

import { OpenRecurringBuysBanner, RecurringBuysBannerFlyoutHook } from './types'

export const useRecurringBuyBannerFlyout: RecurringBuysBannerFlyoutHook = () => {
  const dispatch = useDispatch()

  const showModal: OpenRecurringBuysBanner = useCallback(() => {
    dispatch(
      actions.components.recurringBuy.showModal({
        origin: RecurringBuyOrigins.RECURRING_BUYS_BANNER
      })
    )
  }, [dispatch])

  return showModal
}
