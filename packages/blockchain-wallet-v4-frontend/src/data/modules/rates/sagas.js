import { put, select, call } from 'redux-saga/effects'

import { actions } from 'data'
import * as A from './actions'
import * as S from './selectors'
import { configEquals } from './model'

export default ({ api }) => {
  const subscribeToAdvice = function*({ payload }) {
    const { pair, volume, fix, fiatCurrency } = payload

    yield put(A.updatePairConfig(pair, volume, fix, fiatCurrency))
    yield put(
      actions.middleware.webSocket.rates.openAdviceChannel(
        pair,
        volume,
        fix,
        fiatCurrency
      )
    )
  }

  const unsubscribeFromAdvice = function*({ payload }) {
    const { pair } = payload

    yield put(actions.middleware.webSocket.rates.closeAdviceChannel(pair))
  }

  const subscribeToRates = function*({ payload }) {
    const { pairs } = payload

    yield put(actions.middleware.webSocket.rates.closeRatesChannel())
    yield put(actions.middleware.webSocket.rates.openRatesChannel(pairs))
  }

  const unsubscribeFromRates = function*() {
    yield put(actions.middleware.webSocket.rates.closeRatesChannel())
  }

  const fetchAvailablePairs = function*() {
    try {
      yield put(A.availablePairsLoading())
      const { pairs } = yield call(api.fetchAvailablePairs)
      yield put(A.availablePairsSuccess(pairs))
    } catch (e) {
      yield put(A.availablePairsError(e))
    }
  }

  const updateAdvice = function*({ payload: { quote } }) {
    const { pair, fix, volume, fiatCurrency } = quote
    const currentConfig = yield select(S.getPairConfig(pair))
    if (configEquals(currentConfig, { fix, volume, fiatCurrency })) {
      yield put(A.setPairQuote(pair, quote))
      yield put(A.pairUpdated(pair))
    }
  }

  return {
    subscribeToAdvice,
    unsubscribeFromAdvice,
    fetchAvailablePairs,
    updateAdvice,
    subscribeToRates,
    unsubscribeFromRates
  }
}
