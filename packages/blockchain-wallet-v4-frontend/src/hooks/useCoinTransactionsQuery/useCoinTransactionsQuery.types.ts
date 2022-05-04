import { IngestedSelfCustodyType } from '@core/network/api/coin/types'
import {
  BSOrderType,
  BSTransactionType,
  CoinType,
  FiatBSAndSwapTransactionType,
  ProcessedTxType
} from '@core/types'

import { RemoteHookState } from '../useRemote'

type TransactionItem =
  | BSTransactionType
  | BSOrderType
  | ProcessedTxType
  | FiatBSAndSwapTransactionType
  | IngestedSelfCustodyType

type CoinTransactionsQueryHookProps = {
  coin: CoinType
}

type CoinTransactionsQueryHook = (
  props: CoinTransactionsQueryHookProps
) => RemoteHookState<{ message: string }, TransactionItem[]>

export type { CoinTransactionsQueryHook, CoinTransactionsQueryHookProps, TransactionItem }
