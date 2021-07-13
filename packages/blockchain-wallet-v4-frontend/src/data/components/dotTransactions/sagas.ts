import { put } from 'redux-saga/effects'

import { actions } from 'data'

export const logLocation = 'components/dotTransactions/sagas'

export default () => {
  const initialized = function * () {
    try {
      yield put(actions.core.data.dot.fetchTransactions('', true))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'initialized', e))
    }
  }

  const loadMore = function * () {
    try {
      yield put(actions.core.data.dot.fetchTransactions())
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'loadMore', e))
    }
  }
  return {
    initialized,
    loadMore
  }
}
