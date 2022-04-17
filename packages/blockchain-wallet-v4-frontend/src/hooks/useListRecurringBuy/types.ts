import { RecurringBuyRegisteredList } from 'data/types'

import { RemoteHookState } from '../useRemote'

export type ListRecurringBuyHook = () => RemoteHookState<string, RecurringBuyRegisteredList[]>
