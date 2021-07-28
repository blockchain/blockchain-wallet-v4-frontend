import moment from 'moment'
import { flatten, last, length } from 'ramda'
import { call, put, select, take } from 'redux-saga/effects'

import { APIType } from 'core/network/api'
import { FetchCustodialOrdersAndTransactionsReturnType } from 'core/types'

import Remote from '../../../remote'
import * as selectors from '../../selectors'
import custodialSagas from '../custodial/sagas'
import * as A from './actions'
import * as AT from './actionTypes'
import * as S from './selectors'

const TX_PER_PAGE = 10

export default ({ api }: { api: APIType }) => {
  const { fetchCustodialOrdersAndTransactions } = custodialSagas({ api })

  const fetchRates = function* () {
    try {
      yield put(A.fetchRatesLoading())
      const currencyR = selectors.settings.getCurrency(yield select())
      const currency = currencyR.getOrElse('USD')
      const data = yield call(api.getCoinTicker, 'CLOUT', currency)
      yield put(A.fetchRatesSuccess(data))
    } catch (e) {
      yield put(A.fetchRatesFailure(e.message))
    }
  }

  const fetchTransactions = function* (action: ReturnType<typeof A.fetchTransactions>) {
    try {
      const { payload } = action
      const { reset } = payload
      const pages = yield select(S.getTransactions)
      const offset = reset ? 0 : length(pages) * TX_PER_PAGE
      const transactionsAtBound = yield select(S.getTransactionsAtBound)
      if (Remote.Loading.is(last(pages))) return
      if (transactionsAtBound && !reset) return
      yield put(A.fetchTransactionsLoading(reset))
      const txs: Array<any> = []
      const txPage: Array<any> = txs
      const nextSBTransactionsURL = selectors.data.custodial.getNextSBTransactionsURL(
        yield select(),
        'CLOUT'
      )
      const custodialPage: FetchCustodialOrdersAndTransactionsReturnType = yield call(
        fetchCustodialOrdersAndTransactions,
        txPage,
        offset,
        true,
        'CLOUT',
        reset ? null : nextSBTransactionsURL
      )
      const page = flatten([txPage, custodialPage.orders]).sort((a, b) => {
        return moment(b.insertedAt).valueOf() - moment(a.insertedAt).valueOf()
      })
      yield put(A.fetchTransactionsSuccess(page, reset, true))
    } catch (e) {
      yield put(A.fetchTransactionsFailure(e.message))
    }
  }

  const watchTransactions = function* () {
    while (true) {
      const action = yield take(AT.FETCH_CLOUT_TRANSACTIONS)
      yield call(fetchTransactions, action)
    }
  }

  return {
    fetchRates,
    fetchTransactions,
    watchTransactions
  }
}
