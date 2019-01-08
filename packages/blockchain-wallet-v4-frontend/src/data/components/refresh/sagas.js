import { call, put, select } from 'redux-saga/effects'
import { contains } from 'ramda'
import { actions, selectors } from 'data'

export default () => {
  const refreshClicked = function*() {
    try {
      yield put(actions.core.data.bch.fetchData())
      yield put(actions.core.data.bitcoin.fetchData())
      yield put(actions.core.data.ethereum.fetchData())
      yield put(actions.core.data.xlm.fetchData())
      yield put(actions.core.data.bch.fetchRates())
      yield put(actions.core.data.bitcoin.fetchRates())
      yield put(actions.core.data.ethereum.fetchRates())
      yield put(actions.core.data.xlm.fetchRates())
      const pathname = yield select(selectors.router.getPathname)
      switch (true) {
        case contains('/bch/transactions', pathname):
          yield call(refreshBchTransactions)
          break
        case contains('/btc/transactions', pathname):
          yield call(refreshBtcTransactions)
          break
        case contains('/settings/addresses/bsv', pathname):
          yield call(refreshBsvTransactions)
          break
        case contains('/eth/transactions', pathname):
          yield call(refreshEthTransactions)
          break
        case contains('/xlm/transactions', pathname):
          yield call(refreshXlmTransactions)
          break
        case contains('/lockbox/', pathname):
          yield put(actions.lockbox.initializeDashboard(pathname.split('/')[3]))
          break
        default:
          yield put(actions.core.data.bch.fetchTransactions('', true))
          yield put(actions.core.data.bitcoin.fetchTransactions('', true))
          yield put(actions.core.data.ethereum.fetchTransactions(null, true))
          yield put(actions.core.data.xlm.fetchTransactions('', true))
      }
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(
          'components/refresh/sagas',
          'refresh',
          'Refresh failed.'
        )
      )
    }
  }

  const refreshBchTransactions = function*() {
    yield put(actions.core.data.bch.fetchTransactions('', true))
  }

  const refreshBtcTransactions = function*() {
    yield put(actions.core.data.bitcoin.fetchTransactions('', true))
  }

  const refreshBsvTransactions = function*() {
    yield put(actions.core.data.bsv.fetchTransactions('', true))
  }

  const refreshEthTransactions = function*() {
    yield put(actions.core.data.ethereum.fetchTransactions(null, true))
  }

  const refreshXlmTransactions = function*() {
    yield put(actions.core.data.xlm.fetchTransactions(null, true))
  }

  return {
    refreshClicked,
    refreshBchTransactions,
    refreshBtcTransactions
  }
}
