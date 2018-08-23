import { put } from 'redux-saga/effects'
import { actions } from 'data'
import * as A from './actions'

export default ({ api }) => {
  const subscribeToRate = function*({ payload }) {
    const { pair, volume, fix, fiatCurrency } = payload

    yield put(A.updatePairConfig(pair, volume, fix, fiatCurrency))
    yield put(
      actions.middleware.webSocket.rates.openChannelForPair(
        pair,
        volume,
        fix,
        fiatCurrency
      )
    )
  }

  const unsubscribeFromRate = function*({ payload }) {
    const { pair } = payload
    yield put(actions.middleware.webSocket.rates.closeChannelForPair(pair))
  }

  const fetchAvailablePairs = function*() {
    try {
      yield put(A.availablePairsLoading())
      const { pairs } = yield api.fetchAvailablePairs()
      yield put(A.availablePairsSuccess(pairs))
    } catch (e) {
      yield put(A.availablePairsError(e))
    }
  }

  return {
    subscribeToRate,
    unsubscribeFromRate,
    fetchAvailablePairs
  }
}
