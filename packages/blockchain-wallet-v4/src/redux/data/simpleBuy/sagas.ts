import { call, put } from 'redux-saga/effects'
import moment from 'moment'

import * as A from './actions'
import { APIType } from 'core/network/api'
import {
  CoinType,
  CoinTypeEnum,
  SBOrderType,
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
        if (newestTx && !transactionsAtBound) {
          before = moment(newestTx.insertedAt).toISOString()
        }
        // after the oldest
        if (oldestTx) {
          after = moment(oldestTx.insertedAt).toISOString()
        }
      }

      const orders: Array<SBOrderType> = yield call(api.getSBOrders, {
        before,
        after
      })
      const filteredOrders = orders.filter(order => {
        return order.inputCurrency in CoinTypeEnum
          ? order.inputCurrency === currency
          : order.outputCurrency === currency
      })

      const transactions: ReturnType<typeof api.getSBTransactions> = yield call(
        api.getSBTransactions,
        currency,
        nextSBTransactionsURL
      )

      yield put(
        A.setNextSBTransactionsUrl(currency as CoinType, transactions.next)
      )

      const filteredTxs =
        offset === 0
          ? transactions.items.filter(transaction => {
              return moment(transaction.insertedAt).isAfter(after)
            })
          : transactions.items.filter(transaction => {
              return moment(transaction.insertedAt).isBetween(after, before)
            })

      const response: FetchSBOrdersAndTransactionsReturnType = {
        orders: [...filteredOrders, ...filteredTxs]
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
