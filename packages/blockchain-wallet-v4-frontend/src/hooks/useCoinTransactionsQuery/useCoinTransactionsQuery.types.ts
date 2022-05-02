import { CoinType } from '@core/types'

type CoinTransactionsQueryHookProps = {
  coin: CoinType
}

type CoinTransactionsQueryHook = (props: CoinTransactionsQueryHookProps) => void

export type { CoinTransactionsQueryHook, CoinTransactionsQueryHookProps }
