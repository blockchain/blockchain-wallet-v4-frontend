import { call, put } from 'redux-saga/effects'
import moment from 'moment'

import * as A from './actions'
import { APIType } from 'core/network/api'
import {
  CoinType,
  CoinTypeEnum,
  WalletCurrencyType
} from 'blockchain-wallet-v4/src/types'
import { FetchSBOrdersAndTransactionsReturnType } from './types'
import { ProcessedTxType } from 'core/transactions/types'

export default ({ api }: { api: APIType }) => {
  const fetchSBOrdersAndTransactions = function * (
    page: Array<ProcessedTxType>,
    offset: number,
    transactionsAtBound: boolean,
    currency: WalletCurrencyType,
    nextSBTransactionsURL: string | null
  ) {
    // 🤯
    // Nabu (as of this writing) has multiple types of 'txs' and endpoints
    // this saga is used to fetch 2 of those endpoints and join them
    // for the purpose of viewing alongside your noncustodial txs.
    //
    // 1. /simple-buy/trades a.k.a getSBOrders
    // 2. /payments/transactions a.k.a getSBTransactions
    //
    // getSBOrders takes a before and after param, so we can tell the BE
    // the appropriate range of transactions to return
    //
    // getSBTransactions is set up w/ pagination, so it does not take before or after
    // params

    try {
      const newestTx = page[0]
      const oldestTx = page[page.length - 1]
      let after: string | undefined // ⏫
      let before: string | undefined // ⏬

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
      const orders: ReturnType<typeof api.getSBOrders> = yield call(
        api.getSBOrders,
        {
          before,
          after
        }
      )
      const filteredOrders = orders.filter(order => {
        return order.inputCurrency in CoinTypeEnum
          ? order.inputCurrency === currency
          : order.outputCurrency === currency
      })

      // 2. /payments/transactions a.k.a getSBTransactions
      const transactions: ReturnType<typeof api.getSBTransactions> =
        // if offset > 0 & !nextSBTransactionsURL
        // then there are no more transactions to fetch
        offset > 0 && !nextSBTransactionsURL
          ? yield { prev: null, next: null, items: [] }
          : // get transactions whether or not nextSBTransactionsURL is null
            yield call(api.getSBTransactions, currency, nextSBTransactionsURL)

      yield put(
        A.setNextSBTransactionsUrl(currency as CoinType, transactions.next)
      )

      const response: FetchSBOrdersAndTransactionsReturnType = {
        orders: [...filteredOrders, ...transactions.items]
      }

      return response
    } catch (e) {
      // no simple buy transactions
      return { orders: [] }
    }
  }

  return {
    fetchSBOrdersAndTransactions
  }
}
