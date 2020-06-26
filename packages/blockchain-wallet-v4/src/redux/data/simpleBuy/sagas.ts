import { APIType } from 'core/network/api'
import { call } from 'redux-saga/effects'
import { CoinType, SBOrderType } from 'core/types'
import { ProcessedTxType } from 'core/transactions/types'
import moment from 'moment'

export default ({ api }: { api: APIType }) => {
  // TODO - filter orders by coin
  const fetchSBOrders = function * (
    page: Array<ProcessedTxType>,
    offset: number,
    transactionsAtBound: boolean,
    currency: CoinType
  ) {
    try {
      const latestTx = page[0]
      const oldestTx = page[page.length - 1]
      let after // ⏫
      let before // ⏬

      // if offset === 0 get transactions from after the oldestTx
      // if offset === 0 and no transactions get all before and after
      // if offset === 0 and transactions at bounds get all before and after
      // if offset > 0 get transactions before the latestTx
      // if offset > 0 get transactions after the oldestTx
      // if offset > 0 and no transactions return []
      // if any error is thrown return []

      if (offset === 0) {
        if (transactionsAtBound) {
          // get all before and after
        } else if (oldestTx) {
          after = moment(oldestTx.insertedAt).toISOString()
        }
      } else {
        if (!page[0]) return []
        if (latestTx) {
          before = moment(latestTx.insertedAt).toISOString()
        }
        if (oldestTx) {
          after = moment(oldestTx.insertedAt).toISOString()
        }
      }

      const orders: Array<SBOrderType> = yield call(api.getSBOrders, {
        before,
        after
      })
      return orders.filter(order => order.outputCurrency === currency)
    } catch (e) {
      // no simple buy transactions
      return []
    }
  }

  return {
    fetchSBOrders
  }
}
