import { useDispatch, useSelector } from 'react-redux'

import { actions, selectors } from 'data'

import { useEffectOnce } from '../useEffectOnce'
import { useListRecurringBuyForCoinHook } from './types'

export const useListRecurringBuyForCoin: useListRecurringBuyForCoinHook = ({ coin }) => {
  const dispatch = useDispatch()

  const data = useSelector(selectors.components.recurringBuy.getRegisteredListByCoin(coin))

  useEffectOnce(() => {
    dispatch(actions.components.recurringBuy.fetchRegisteredList())
  })

  return {
    data
  }
}
