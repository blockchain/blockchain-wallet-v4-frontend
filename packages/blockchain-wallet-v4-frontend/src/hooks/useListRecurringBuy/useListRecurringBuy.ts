import { useDispatch } from 'react-redux'

import { actions, selectors } from 'data'

import { useEffectOnce } from '../useEffectOnce'
import { useRemote } from '../useRemote'
import { ListRecurringBuyHook } from './types'

export const useListRecurringBuy: ListRecurringBuyHook = () => {
  const dispatch = useDispatch()

  useEffectOnce(() => {
    dispatch(actions.components.recurringBuy.fetchRegisteredList())
  })

  return useRemote(selectors.components.recurringBuy.getRegisteredList)
}
