import { difference, compose, map } from 'ramda'
import { put, select, all } from 'redux-saga/effects'
import { actions } from 'data'
import * as S from './selectors'
import * as A from './actions'

export default ({ api }) => {
  const subscribeToRates = function*({ payload }) {
    const { pairs } = payload
    const prevSubscriptions = yield select(S.getActivePairs)

    yield compose(
      all,
      map(pair => put(A.increasePairRefCount(pair)))
    )(pairs)
    const currentSubscriptions = yield select(S.getActivePairs)

    yield compose(
      put,
      actions.middleware.webSocket.rates.openChannelForPairs,
      difference
    )(currentSubscriptions, prevSubscriptions)
  }

  const unsubscribeFromRates = function*({ payload }) {
    const { pairs } = payload
    const prevSubscriptions = yield select(S.getActivePairs)

    yield compose(
      all,
      map(pair => put(A.decreasePairRefCount(pair)))
    )(pairs)
    const currentSubscriptions = yield select(S.getActivePairs)

    yield compose(
      put,
      actions.middleware.webSocket.rates.closeChannelForPairs,
      difference
    )(prevSubscriptions, currentSubscriptions)
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
    subscribeToRates,
    unsubscribeFromRates,
    fetchAvailablePairs
  }
}
