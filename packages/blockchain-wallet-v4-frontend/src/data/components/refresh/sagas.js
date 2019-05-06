import { call, put, select } from 'redux-saga/effects'
import { contains } from 'ramda'
import { actions, selectors } from 'data'

export default () => {
  const refreshClicked = function * () {
    try {
      // Data (balance)
      yield put(actions.core.data.bch.fetchData())
      yield put(actions.core.data.btc.fetchData())
      yield put(actions.core.data.eth.fetchData())
      yield put(actions.core.data.xlm.fetchData())
      yield put(actions.core.data.eth.fetchErc20Data('pax'))
      // Rates
      yield put(actions.core.data.bch.fetchRates())
      yield put(actions.core.data.btc.fetchRates())
      yield put(actions.core.data.eth.fetchRates())
      yield put(actions.core.data.xlm.fetchRates())
      yield put(actions.core.data.eth.fetchErc20Rates('pax'))
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
        case contains('/pax/transactions', pathname):
          yield call(refreshErc20Transactions, 'pax')
          break
        case contains('/xlm/transactions', pathname):
          yield call(refreshXlmTransactions)
          break
        case contains('/lockbox/', pathname):
          yield put(actions.lockbox.initializeDashboard(pathname.split('/')[3]))
          break
        default:
          yield put(actions.core.data.bch.fetchTransactions('', true))
          yield put(actions.core.data.btc.fetchTransactions('', true))
          yield put(actions.core.data.eth.fetchTransactions(null, true))
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

  const refreshBchTransactions = function * () {
    yield put(actions.core.data.bch.fetchTransactions('', true))
  }

  const refreshBtcTransactions = function * () {
    yield put(actions.core.data.btc.fetchTransactions('', true))
  }

  const refreshBsvTransactions = function * () {
    yield put(actions.core.data.bsv.fetchTransactions('', true))
  }

  const refreshEthTransactions = function * () {
    yield put(actions.core.data.eth.fetchTransactions(null, true))
  }

  const refreshErc20Transactions = function * (coin) {
    yield put(actions.core.data.eth.fetchErc20Transactions(coin, true))
  }

  const refreshXlmTransactions = function * () {
    yield put(actions.core.data.xlm.fetchTransactions(null, true))
  }

  return {
    refreshClicked,
    refreshBchTransactions,
    refreshBtcTransactions
  }
}
