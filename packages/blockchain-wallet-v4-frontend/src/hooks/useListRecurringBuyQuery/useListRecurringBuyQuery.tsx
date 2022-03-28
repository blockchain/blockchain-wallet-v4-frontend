import { useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { actions, selectors } from 'data'

import { useEffectOnce } from '../useEffectOnce'
import { ListRecurringBuySelector, useListRecurringBuyQueryHook } from './types'

export const useListRecurringBuyQuery: useListRecurringBuyQueryHook = (query = {}) => {
  const dispatch = useDispatch()

  const selector: ListRecurringBuySelector = useMemo(() => {
    const coinEqualsTo = query?.coin?.equal

    if (coinEqualsTo) {
      selectors.components.recurringBuy.getRegisteredListByCoin(coinEqualsTo)
    }

    return (state) => selectors.components.recurringBuy.getRegisteredList(state).data
  }, [query])

  const data = useSelector(selector)

  useEffectOnce(() => {
    dispatch(actions.components.recurringBuy.fetchRegisteredList())
  })

  return {
    data
  }
}
