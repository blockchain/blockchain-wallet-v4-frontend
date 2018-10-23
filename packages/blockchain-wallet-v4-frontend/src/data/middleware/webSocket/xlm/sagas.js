import { put, select } from 'redux-saga/effects'
import * as T from 'services/AlertService'
import { equals, path } from 'ramda'

import { actions, selectors } from 'data'

export default () => {
  const onMessage = function*({ payload }) {
    try {
      const { accountId, tx } = payload
      if (tx.source_account !== accountId) {
        yield put(actions.alerts.displaySuccess(T.PAYMENT_RECEIVED_XLM))
        const pathname = yield select(selectors.router.getPathname)
        if (equals(pathname, '/xlm/transactions')) {
          yield put(actions.core.data.xlm.fetchTransactions(null, true))
        }
        yield put(actions.core.data.xlm.fetchData())
      }
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(
          'middleware/webSocket/xlm/sagas',
          'onOpen',
          e.message
        )
      )
    }
  }

  const onError = action => {
    const message = path(['payload', 'error', 'message'], action)
    actions.logs.logErrorMessage(
      'middleware/webSocket/xlm/sagas',
      'streamError',
      message
    )
  }

  return {
    onMessage,
    onError
  }
}
