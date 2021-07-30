import { put } from 'redux-saga/effects'

import { actions } from 'data'

import * as A from './actions'

export const logLocation = 'components/coinTransactions/sagas'

export default () => {
  const initialized = function* (action: ReturnType<typeof A.initialized>) {
    try {
      yield put(actions.core.data.coins.fetchTransactions(action.payload.coin, true))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'initialized', e))
    }
  }

  const loadMore = function* (action: ReturnType<typeof A.loadMore>) {
    try {
      yield put(actions.core.data.coins.fetchTransactions(action.payload.coin))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'loadMore', e))
    }
  }
  return {
    initialized,
    loadMore
  }
}
