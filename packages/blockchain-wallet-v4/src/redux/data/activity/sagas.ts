import { call, put, select } from 'redux-saga/effects'

import { APIType } from 'core/network/api'

import * as A from './actions'
import { errorHandler } from 'blockchain-wallet-v4/src/utils'
import { NabuProducts } from './types'
import { NonCustodialCoins } from 'core/types'
import { selectors } from 'data'

export default ({ api }: { api: APIType }) => {
  const fetchActivity = function * () {
    try {
      for (const value of NabuProducts) {
        yield put(A.fetchCustodialActivityLoading(value))
      }

      for (const value of NonCustodialCoins) {
        yield put(A.fetchNonCustodialActivityLoading(value))
      }

      for (const value of NabuProducts) {
        try {
          let transactions: ReturnType<typeof api.getCustodialTxs>
          let orders: ReturnType<typeof api.getSBOrders> = []
          switch (value) {
            case 'SIMPLEBUY':
              transactions = yield call(api.getCustodialTxs, value)
              orders = yield call(api.getSBOrders, {})
              break
            // TODO
            case 'SWAP':
              transactions = { items: [], next: null, prev: null }
              orders = []
              break
            default:
              transactions = yield call(api.getCustodialTxs, value)
          }

          yield put(
            A.fetchCustodialActivitySuccess(value, transactions, orders)
          )
        } catch (e) {
          const error = errorHandler(e)
          yield put(A.fetchCustodialActivityFailure(value, error))
        }
      }

      for (const value of NonCustodialCoins) {
        let transactions
        try {
          switch (value) {
            case 'BTC':
              const context: Array<string> = selectors.core.data.btc.getContext(
                yield select()
              )
              const response = yield call(() =>
                api.getCoinTxs({
                  coin: 'BTC',
                  address: context,
                  onlyShow: context,
                  offset: 0,
                  pageSize: 10
                })
              )
              console.log(transactions)
            default:
              console.log(value)
              break
          }

          yield put(A.fetchNonCustodialActivitySuccess(value, transactions))
        } catch (e) {
          const error = errorHandler(e)
          yield put(A.fetchNonCustodialActivityFailure(value, error))
        }
      }
    } catch (e) {
      const error = errorHandler(e)
      // not enough info to do anything
      // eslint-disable-next-line
      console.log(`Activity fetch failure: ${error}`)
    }
  }

  return {
    fetchActivity
  }
}
