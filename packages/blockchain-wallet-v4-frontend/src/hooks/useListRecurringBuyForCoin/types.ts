import { RecurringBuyRegisteredList } from 'data/types'

export type useListRecurringBuyForCoinHook = (props: { coin?: string }) => {
  data: RecurringBuyRegisteredList[] | undefined
}
