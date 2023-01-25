import { PartialClientErrorProperties } from 'data/analytics/types/errors'
import { BankTransferAccountType } from 'data/types'

import { RemoteHookState } from '../useRemote'

type BankAccountsQueryHook = () => RemoteHookState<
  PartialClientErrorProperties,
  BankTransferAccountType[]
>

export type { BankAccountsQueryHook }
