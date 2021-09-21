import moment from 'moment'
import { flatten, last, length } from 'ramda'
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
    const coins = S.getAllCoins()
    const defaultFiat = (yield select(selectors.settings.getCurrency)).getOrElse('USD')

    const request = coins.map((coin) => ({
      base: coin,
      quote: defaultFiat
    }))

    try {
      yield put(A.fetchBtcTickerLoading())
      const response: ReturnType<typeof api.getBtcTicker> = yield call(api.getBtcTicker)
      yield put(A.fetchBtcTickerSuccess(response))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchBtcTickerFailure(error))
    }

    try {
      yield put(A.fetchCoinsRatesLoading())
      const response: ReturnType<typeof api.getCoinPrices> = yield call(api.getCoinPrices, request)
      yield put(A.fetchCoinsRatesSuccess(response))
    } catch (e) {
      const error =
        typeof errorHandler(e) === 'string' ? errorHandler(e) : 'Failed to fetch prices.'
      yield put(A.fetchCoinsRatesFailure(error))
    }
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
