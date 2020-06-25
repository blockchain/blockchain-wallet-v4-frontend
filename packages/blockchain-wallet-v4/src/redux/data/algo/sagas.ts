import { call, put, select } from 'redux-saga/effects'
import { flatten, last, length } from 'ramda'

import { APIType } from 'core/network/api'
import Remote from '../../../remote'

import * as A from './actions'
import * as S from './selectors'
import { SBOrderType } from 'core/types'
import moment from 'moment'
import simpleBuySagas from '../simpleBuy/sagas'

const TX_PER_PAGE = 10

export default ({ api }: { api: APIType }) => {
  const { fetchSBOrders } = simpleBuySagas({ api })

  const fetchRates = function * () {
    try {
      yield put(A.fetchRatesLoading())
      const data = yield call(api.getCoinTicker, 'ALGO')
      yield put(A.fetchRatesSuccess(data))
    } catch (e) {
      yield put(A.fetchRatesFailure(e.message))
    }
  }

  const fetchTransactions = function * (
    action: ReturnType<typeof A.fetchTransactions>
  ) {
    try {
      const { payload } = action
      const { reset } = payload
      const pages = yield select(S.getTransactions)
      const offset = reset ? 0 : length(pages) * TX_PER_PAGE
      const transactionsAtBound = yield select(S.getTransactionsAtBound)
      if (Remote.Loading.is(last(pages))) return
      if (transactionsAtBound && !reset) return
      yield put(A.fetchTransactionsLoading(reset))
      let txs: Array<any> = []
      const txPage: Array<any> = txs
      const sbPage: Array<SBOrderType> = yield call(
        fetchSBOrders,
        txPage,
        offset,
        true,
        'ALGO'
      )
      const page = flatten([txPage, sbPage]).sort((a, b) => {
        return moment(b.insertedAt).valueOf() - moment(a.insertedAt).valueOf()
      })
      yield put(A.fetchTransactionsSuccess(page, reset, true))
    } catch (e) {
      yield put(A.fetchTransactionsFailure(e.message))
    }
  }

  return {
    fetchRates,
    fetchTransactions
  }
}
