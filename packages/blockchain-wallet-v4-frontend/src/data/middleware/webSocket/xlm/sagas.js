import { includes, path } from 'ramda'
import { call, put, select } from 'redux-saga/effects'

import { actions, selectors } from 'data'
import * as T from 'services/alerts'

export default () => {
  const addWalletTransaction = function* () {
    // refresh transaction list
    yield put(actions.core.data.xlm.fetchTransactions(null, true))
  }

  const onMessage = function* ({ payload }) {
    try {
      const { accountId, tx } = payload
      if (tx.source_account !== accountId) {
        yield put(actions.alerts.displaySuccess(T.PAYMENT_RECEIVED_XLM))
      }
      yield put(actions.core.data.xlm.fetchData())
      const pathname = yield select(selectors.router.getPathname)
      if (includes(pathname, ['/xlm/transactions', '/home'])) yield call(addWalletTransaction, tx)
    } catch (e) {
      yield put(actions.logs.logErrorMessage('middleware/webSocket/xlm/sagas', 'onOpen', e.message))
    }
  }

  const onError = (action) => {
    const message = path(['payload', 'error', 'message'], action)
    actions.logs.logErrorMessage('middleware/webSocket/xlm/sagas', 'streamError', message)
  }

  return {
    onError,
    onMessage
  }
}
