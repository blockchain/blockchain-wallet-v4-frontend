import moment from 'moment'
import { call, put, select } from 'redux-saga/effects'

import {
  CoinType,
  ProcessedSwapOrderType,
  SBPendingTransactionStateEnum
} from 'blockchain-wallet-v4/src/types'
import { APIType } from 'core/network/api'
import { ProcessedTxType } from 'core/transactions/types'

import * as A from './actions'
import * as S from './selectors'
import { FetchCustodialOrdersAndTransactionsReturnType } from './types'

export default ({ api }: { api: APIType }) => {
  const fetchCustodialOrdersAndTransactions = function* (
    page: Array<ProcessedTxType>,
    offset: number,
    transactionsAtBound: boolean,
    currency: string,
    nextSBTransactionsURL: string | null
  ) {
    // 🤯
    // Nabu (as of this writing) has multiple types of 'txs' and endpoints
    // this saga is used to fetch 3 of those endpoints and join them
    // for the purpose of viewing alongside your noncustodial txs.
    //
    // 1. /simple-buy/trades a.k.a getSBOrders
    // 2. /payments/transactions a.k.a getSBTransactions
    // 3. /unified a.k.a swaps
    //
    // getSBOrders takes a before and after param, so we can tell the BE
    // the appropriate range of transactions to return
    //
    // getSBTransactions is set up w/ pagination, so it does not take before or after
    // params

    const newestTx = page[0]
    const oldestTx = page[page.length - 1]
    let before: string | undefined // ⏬
    let after: string | undefined // ⏫

    try {
      // if offset === 0 get transactions from after the oldestTx
      // if offset === 0 and no transactions get all before and after
      // if offset === 0 and transactions at bounds get all before and after
      // if offset > 0 get transactions before the newestTx
      // if offset > 0 get transactions after the oldestTx
      // if offset > 0 and no transactions return []
      // if any error is thrown return []

      if (offset === 0) {
        if (transactionsAtBound) {
          // get all
        } else if (oldestTx) {
          // get all after the oldest tx on the first page
          after = moment(oldestTx.insertedAt).toISOString()
        }
      } else {
        if (!page[0]) return []
        // subsequent pages
        // before the newest
        if (newestTx) {
          before = moment(newestTx.insertedAt).toISOString()
        }
        // after the oldest
        if (oldestTx) {
          after = moment(oldestTx.insertedAt).toISOString()
        }
      }

      // 1. /simple-buy/trades a.k.a getSBOrders
      const orders: ReturnType<typeof api.getSBOrders> = yield call(api.getSBOrders, {
        after,
        before
      })
      const filteredOrders = orders.filter((order) => {
        return order.side === 'SELL'
          ? order.inputCurrency === currency
          : order.outputCurrency === currency
      })

      // 2. /payments/transactions a.k.a getSBTransactions
      const transactions: ReturnType<typeof api.getSBTransactions> =
        // if offset > 0 & !nextSBTransactionsURL
        // then there are no more transactions to fetch
        offset > 0 && !nextSBTransactionsURL
          ? yield { items: [], next: null, prev: null }
          : // get transactions whether or not nextSBTransactionsURL is null
            yield call(api.getSBTransactions, {
              currency,
              next: nextSBTransactionsURL
            })

      const pendingTxsOnState = S.getSBTransactionsPending(yield select(), currency)
      const pendingTxs = transactions.items.filter(
        (val) => val.state in SBPendingTransactionStateEnum
      )

      yield put(
        A.setSBCoreCoinData(
          currency as CoinType,
          transactions.next,
          offset === 0 ? pendingTxs.length : pendingTxs.length + pendingTxsOnState
        )
      )

      // 3. swap transactions
      const swaps: ReturnType<typeof api.getUnifiedSwapTrades> = yield call(
        api.getUnifiedSwapTrades,
        currency as CoinType,
        20,
        before,
        after
      )
      const processedSwaps: Array<ProcessedSwapOrderType> = swaps.map((swap) => ({
        ...swap,
        insertedAt: swap.createdAt
      }))
      const response: FetchCustodialOrdersAndTransactionsReturnType = {
        orders: [...filteredOrders, ...transactions.items, ...processedSwaps]
      }

      return response
    } catch (e) {
      // no simple buy transactions
      return { orders: [] }
    }
  }

  return {
    fetchCustodialOrdersAndTransactions
  }
}
