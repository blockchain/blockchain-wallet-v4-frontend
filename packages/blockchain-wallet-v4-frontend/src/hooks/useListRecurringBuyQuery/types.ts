import { RootState } from 'data/rootReducer'
import { RecurringBuyRegisteredList } from 'data/types'

export type ListRecurringBuyQuery = {
  coin?: { equal?: string }
}
export type useListRecurringBuyQueryHook = (query?: ListRecurringBuyQuery) => {
  data: RecurringBuyRegisteredList[] | undefined
}

export type ListRecurringBuySelector = (
  state: RootState
) => RecurringBuyRegisteredList[] | undefined
