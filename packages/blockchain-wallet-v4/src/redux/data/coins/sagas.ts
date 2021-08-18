import moment from 'moment'
import { flatten, last, length, toUpper } from 'ramda'
import { all, call, put, select, take } from 'redux-saga/effects'

import { errorHandler } from 'blockchain-wallet-v4/src/utils'
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

  const fetchCoinsRates = function* () {
    const coins = S.getCoins()

    yield all(
      coins.map(function* (coin) {
        try {
          yield put(A.fetchCoinsRatesLoading(coin))
          const data = yield call(api.getCoinTicker, toUpper(coin))
          yield put(A.fetchCoinsRatesSuccess(coin, data))
        } catch (e) {
          const error = errorHandler(e)
          yield put(A.fetchCoinsRatesFailure(coin, error))
        }
      })
    )
  }

  const fetchTransactions = function* (action: ReturnType<typeof A.fetchTransactions>) {
    const { payload } = action
    try {
      const { reset } = payload
      const pages = S.getTransactions(payload.coin, yield select())
      const offset = reset ? 0 : length(pages) * TX_PER_PAGE
      const transactionsAtBound = S.getTransactionsAtBound(payload.coin, yield select())
      if (Remote.Loading.is(last(pages))) return
      if (transactionsAtBound && !reset) return
      yield put(A.fetchTransactionsLoading(payload.coin, reset))
      const txs: Array<any> = []
      const txPage: Array<any> = txs
      const nextSBTransactionsURL = selectors.data.custodial.getNextSBTransactionsURL(
        yield select(),
        payload.coin
      )
      const custodialPage: FetchCustodialOrdersAndTransactionsReturnType = yield call(
        fetchCustodialOrdersAndTransactions,
        txPage,
        offset,
        true,
        payload.coin,
        reset ? null : nextSBTransactionsURL
      )
      const page = flatten([txPage, custodialPage.orders]).sort((a, b) => {
        return moment(b.insertedAt).valueOf() - moment(a.insertedAt).valueOf()
      })
      const atBounds = page.length < TX_PER_PAGE
      yield put(A.transactionsAtBound(payload.coin, atBounds))
      yield put(A.fetchTransactionsSuccess(payload.coin, page, reset, true))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchTransactionsFailure(payload.coin, error))
    }
  }

  const watchTransactions = function* () {
    while (true) {
      const action = yield take(AT.FETCH_COINS_TRANSACTIONS)
      yield call(fetchTransactions, action)
    }
  }

  return {
    fetchCoinsRates,
    fetchTransactions,
    watchTransactions
  }
}
