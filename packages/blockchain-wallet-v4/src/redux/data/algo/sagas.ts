import { call, put, select, take } from 'redux-saga/effects'
import { flatten, last, length } from 'ramda'

import { APIType } from 'core/network/api'
import Remote from '../../../remote'

import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'
import * as selectors from '../../selectors'
import { FetchSBOrdersAndTransactionsReturnType } from 'core/types'
import moment from 'moment'
import simpleBuySagas from '../simpleBuy/sagas'

const TX_PER_PAGE = 10

export default ({ api }: { api: APIType }) => {
  const { fetchSBOrdersAndTransactions } = simpleBuySagas({ api })

  const fetchRates = function * () {
    try {
      yield put(A.fetchRatesLoading())
      const data = yield call(api.getCoinTicker, 'ALGO')
      yield put(A.fetchRatesSuccess(data))
    } catch (e) {
      yield put(A.fetchRatesFailure(e.message))
    }
  }

  const watchTransactions = function * () {
    while (true) {
      const action = yield take(AT.FETCH_ALGO_TRANSACTIONS)
      yield call(fetchTransactions, action)
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
      const nextSBTransactionsURL = selectors.data.sbCore.getNextSBTransactionsURL(
        yield select(),
        'ALGO'
      )
      const sbPage: FetchSBOrdersAndTransactionsReturnType = yield call(
        fetchSBOrdersAndTransactions,
        txPage,
        offset,
        true,
        'ALGO',
        reset ? null : nextSBTransactionsURL
      )
      const page = flatten([txPage, sbPage.orders]).sort((a, b) => {
        return moment(b.insertedAt).valueOf() - moment(a.insertedAt).valueOf()
      })
      yield put(A.fetchTransactionsSuccess(page, reset, true))
    } catch (e) {
      yield put(A.fetchTransactionsFailure(e.message))
    }
  }

  return {
    fetchRates,
    fetchTransactions,
    watchTransactions
  }
}
