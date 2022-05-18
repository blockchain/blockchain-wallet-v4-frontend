import { BankTransferAccountType } from 'data/types'

import { RemoteHookState } from '../useRemote'

type BankAccountsQueryHook = () => RemoteHookState<string, BankTransferAccountType[]>

export type { BankAccountsQueryHook }
