import { actions } from 'data'
import { put } from 'redux-saga/effects'

export const logLocation = 'components/btcTransactions/sagas'

export default () => {
  const initialized = function * () {
    try {
      yield put(actions.core.data.xlm.fetchTransactions('', true))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'initialized', e))
    }
  }

  const loadMore = function * () {
    try {
      yield put(actions.core.data.xlm.fetchTransactions())
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'loadMore', e))
    }
  }

  const reportClicked = function * () {
    try {
      yield put(
        actions.modals.showModal('DownloadTransactions', { coin: 'XLM' })
      )
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'reportClicked', e))
    }
  }

  return {
    initialized,
    reportClicked,
    loadMore
  }
}
