import { and, compose, head, last, prop } from 'ramda'
import { call, put, select } from 'redux-saga/effects'

import { actions, selectors } from 'data'

import * as A from './actions'
import { configEquals, splitPair } from './model'
import * as S from './selectors'

export default ({ api }) => {
  const subscribeToAdvice = function* ({ payload }) {
    const { fiatCurrency, fix, pair, volume } = payload

    yield put(A.updatePairConfig(pair, volume, fix, fiatCurrency))
    yield put(actions.middleware.webSocket.rates.openAdviceChannel(pair, volume, fix, fiatCurrency))
  }

  const unsubscribeFromAdvice = function* ({ payload }) {
    const { pair } = payload

    yield put(actions.middleware.webSocket.rates.closeAdviceChannel(pair))
  }

  const subscribeToRates = function* ({ payload }) {
    const { pairs } = payload

    yield put(actions.middleware.webSocket.rates.closeRatesChannel())
    yield put(actions.middleware.webSocket.rates.openRatesChannel(pairs))
  }

  const unsubscribeFromRates = function* () {
    yield put(actions.middleware.webSocket.rates.closeRatesChannel())
  }

  const fetchAvailablePairs = function* () {
    try {
      yield put(A.availablePairsLoading())
      const { pairs } = yield call(api.fetchAvailablePairs)

      yield put(A.availablePairsSuccess(pairs))
    } catch (e) {
      yield put(A.availablePairsError(e))
    }
  }

  const updateAdvice = function* ({ payload: { quote } }) {
    const { fiatCurrency, fix, pair, volume } = quote
    const currentConfig = yield select(S.getPairConfig(pair))
    if (configEquals(currentConfig, { fiatCurrency, fix, volume })) {
      yield put(A.setPairQuote(pair, quote))
      yield put(A.pairUpdated(pair))
    }
  }

  return {
    fetchAvailablePairs,
    subscribeToAdvice,
    subscribeToRates,
    unsubscribeFromAdvice,
    unsubscribeFromRates,
    updateAdvice
  }
}
