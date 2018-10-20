import { select, put } from 'redux-saga/effects'
import { equals } from 'ramda'
import { actions, selectors } from 'data'

export const logLocation = 'components/btcTransactions/sagas'

export default () => {
  const initialized = function*() {
    try {
      yield put(actions.core.data.xlm.fetchTransactions('', true))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'initialized', e))
    }
  }

  const reportClicked = function*() {
    try {
      yield put(actions.modals.showModal('TransactionReport', { coin: 'XLM' }))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'reportClicked', e))
    }
  }

  const scrollUpdated = function*(action) {
    try {
      const pathname = yield select(selectors.router.getPathname)
      if (!equals(pathname, '/xlm/transactions')) return
      const threshold = 250
      const { yMax, yOffset } = action.payload
      if (yMax - yOffset < threshold) {
        yield put(actions.core.data.xlm.fetchTransactions(null, false))
      }
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'scrollUpdated', e))
    }
  }

  return {
    initialized,
    reportClicked,
    scrollUpdated
  }
}
