import { useCallback } from 'react'
import { useDispatch } from 'react-redux'

import { actions } from 'data'
import { RecurringBuyOrigins, RecurringBuyStepType } from 'data/types'

import { useOpenRecurringBuyFlayoutHook, useOpenRecurringBuyFlayoutHookOpenCallback } from './types'

export const useOpenRecurringBuyFlayout: useOpenRecurringBuyFlayoutHook = () => {
  const dispatch = useDispatch()

  const open: useOpenRecurringBuyFlayoutHookOpenCallback = useCallback(
    ({ origin, recurringBuy }) => {
      dispatch(actions.components.recurringBuy.setActive(recurringBuy))

      dispatch(
        actions.components.recurringBuy.showModal({
          origin: RecurringBuyOrigins[origin]
        })
      )

      dispatch(
        actions.components.recurringBuy.setStep({
          origin: RecurringBuyOrigins[origin],
          step: RecurringBuyStepType.DETAILS
        })
      )
    },
    [dispatch]
  )

  return open
}
