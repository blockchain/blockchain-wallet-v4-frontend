import { APIType } from 'core/network/api'
import { call } from 'redux-saga/effects'
import { ProcessedTxType } from 'core/transactions/types'
import moment from 'moment'

export default ({ api }: { api: APIType }) => {
  // TODO - filter orders by coin
  const fetchSBOrders = function * (
    page: Array<ProcessedTxType>,
    offset: number
  ) {
    try {
      const latestTx = page[0]
      const oldestTx = page[page.length - 1]
      let after // ⏫
      let before // ⏬

      // if offset is 0 get transactions from after the oldestTx
      // if offset > 0 get transactions before the latestTx
      // if offset > 0 get transactions after the oldestTx
      // if no transactions get all before and after
      if (offset === 0) {
        if (oldestTx) {
          after = moment(oldestTx.insertedAt).toISOString()
        }
      } else {
        if (latestTx) {
          before = moment(latestTx.insertedAt).toISOString()
        }
        if (oldestTx) {
          after = moment(oldestTx.insertedAt).toISOString()
        }
      }

      return yield call(api.getSBOrders, { before, after })
    } catch (e) {
      // no simple buy transactions
    }
  }

  return {
    fetchSBOrders
  }
}
