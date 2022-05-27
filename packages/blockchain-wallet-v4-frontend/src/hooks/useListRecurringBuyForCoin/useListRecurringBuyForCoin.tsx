import { useListRecurringBuy } from '../useListRecurringBuy'
import { ListRecurringBuyForCoinHook } from './types'

export const useListRecurringBuyForCoin: ListRecurringBuyForCoinHook = ({ coin }) => {
  const state = useListRecurringBuy()

  return {
    ...state,
    data: state?.data?.filter((recurringBuy) => recurringBuy.destinationCurrency === coin)
  }
}
