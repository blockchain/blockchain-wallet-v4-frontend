import { put } from 'redux-saga/effects'

import { actions } from 'data'

import * as A from './actions'

export const logLocation = 'components/fiatTransactions/sagas'

export default () => {
  const initialized = function * (action: ReturnType<typeof A.initialized>) {
    try {
      yield put(actions.components.simpleBuy.fetchSBBalances(undefined, true))
      yield put(
        actions.core.data.fiat.fetchTransactions(action.payload.currency, true)
      )
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'initialized', e))
    }
  }

  const loadMore = function * (action: ReturnType<typeof A.loadMore>) {
    try {
      yield put(
        actions.core.data.fiat.fetchTransactions(action.payload.currency)
      )
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'loadMore', e))
    }
  }
  return {
    initialized,
    loadMore
  }
}
