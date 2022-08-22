import { getTime } from 'date-fns'
import { flatten, last, length } from 'ramda'
import { call, delay, put, select, take } from 'redux-saga/effects'

import { APIType } from '@core/network/api'
import { FetchCustodialOrdersAndTransactionsReturnType } from '@core/types'
import { errorHandler } from '@core/utils'

import Remote from '../../../remote'
import * as selectors from '../../selectors'
import custodialSagas from '../custodial/sagas'
import { getPubKey } from '../self-custody/sagas'
import * as S from './selectors'
import { actions as A } from './slice'

const TX_PER_PAGE = 10

export default ({ api }: { api: APIType }) => {
  const { fetchCustodialOrdersAndTransactions } = custodialSagas({ api })

  // checks for existence of window.coins data and sets an is loaded flag on state
  const pollForCoinData = function* () {
    try {
      let callCount = 0

      // wait for coin data for upto 10 seconds before throwing error
      while (true) {
        callCount += 1
        if (Object.keys(window.coins || {}).length) break
        if (callCount > 100) throw new Error('load timeout exceeded')
        yield delay(250)
      }
      yield put(A.setCoinDataLoaded())
    } catch (e) {
      const errorRoute = '#app-error?error=errorAssetsApi'
      // manually route to error/maintenance page
      if (window.history.replaceState) {
        window.history.replaceState(null, '', errorRoute)
      } else {
        window.location.hash = errorRoute
      }
      // eslint-disable-next-line no-console
      console.log(`Failed to fetch window.coins: ${e}`)
    }
  }

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
      yield put(A.fetchCoinsRatesSuccess({ rates: response }))
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
      yield put(A.fetchTransactionsLoading({ coin: payload.coin, reset }))
      const txs: Array<any> = []
      const txPage: Array<any> = txs
      const nextBSTransactionsURL = selectors.data.custodial.getNextBSTransactionsURL(
        yield select(),
        payload.coin
      )
      const custodialPage: FetchCustodialOrdersAndTransactionsReturnType = yield call(
        fetchCustodialOrdersAndTransactions,
        txPage,
        offset,
        true,
        payload.coin,
        reset ? null : nextBSTransactionsURL
      )
      const txList = [txPage, custodialPage.orders]
      if (window.coins[payload.coin].coinfig.products.includes('DynamicSelfCustody')) {
        const pubKey = yield call(getPubKey, '')
        const { results }: ReturnType<typeof api.deriveAddress> = yield call(
          api.deriveAddress,
          payload.coin,
          pubKey
        )
        const addresses = results.map(({ address }) => address)
        const selfCustodyPage: ReturnType<typeof api.txHistory> = yield call(api.txHistory, [
          { descriptor: 'default', pubKey, style: 'SINGLE' }
        ])
        const history = selfCustodyPage.history.map((val) => {
          const type = addresses.includes(
            val.movements.find(({ type }) => type === 'SENT')?.address || ''
          )
            ? 'SENT'
            : 'RECEIVED'
          return {
            ...val,
            amount: val.movements.find(({ type }) => type === 'SENT')?.amount,
            from: val.movements.find(({ type }) => type === 'SENT')?.address,
            insertedAt: val.timestamp,
            to: val.movements.find(({ type }) => type === 'RECEIVED')?.address,
            type
          }
        })
        txList.push(history)
      }
      const newPages = flatten([txList])
      const page = newPages.sort((a, b) => {
        if (a.insertedAt === null) return -1
        if (b.insertedAt === null) return 1
        return getTime(new Date(b.insertedAt)) - getTime(new Date(a.insertedAt))
      })
      const atBound = page.length < TX_PER_PAGE * newPages.length
      yield put(A.setTransactionsAtBound({ atBound, coin: payload.coin }))
      yield put(A.fetchTransactionsSuccess({ coin: payload.coin, transactions: page }))
    } catch (e) {
      const error = errorHandler(e)
      yield put(A.fetchTransactionsFailure({ coin: payload.coin, error }))
    }
  }

  const watchTransactions = function* () {
    while (true) {
      const action = yield take(A.fetchTransactions.type)
      yield call(fetchTransactions, action)
    }
  }

  return {
    fetchCoinsRates,
    fetchTransactions,
    pollForCoinData,
    watchTransactions
  }
}
