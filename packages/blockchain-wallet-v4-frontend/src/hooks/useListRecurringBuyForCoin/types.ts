import { RecurringBuyRegisteredList } from 'data/types'

import { RemoteHookState } from '../useRemote'

export type ListRecurringBuyForCoinHook = (props: {
  coin?: string
}) => RemoteHookState<string, RecurringBuyRegisteredList[]>
