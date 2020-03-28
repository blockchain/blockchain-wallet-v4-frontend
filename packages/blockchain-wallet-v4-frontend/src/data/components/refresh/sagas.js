import { actions, selectors } from 'data'
import { call, put, select } from 'redux-saga/effects'
import { contains } from 'ramda'

export default () => {
  const refreshClicked = function * () {
    try {
      // User
      yield put(actions.modules.profile.fetchUser())
      // Data (balance)
      yield put(actions.core.data.bch.fetchData())
      yield put(actions.core.data.btc.fetchData())
      yield put(actions.core.data.eth.fetchData())
      yield put(actions.core.data.xlm.fetchData())
      yield put(actions.core.data.eth.fetchErc20Data('pax'))
      yield put(actions.components.simpleBuy.fetchSBBalances())
      yield put(actions.components.simpleBuy.fetchSBOrders())
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
        case contains('/eth/transactions', pathname):
          yield call(refreshEthTransactions)
          break
        case contains('/usd-d/transactions', pathname):
          yield call(refreshErc20Transactions, 'pax')
          break
        case contains('/xlm/transactions', pathname):
          yield call(refreshXlmTransactions)
          break
        case contains('/lockbox/', pathname):
          yield put(actions.lockbox.initializeDashboard(pathname.split('/')[3]))
          break
        case contains('profile', pathname):
        case contains('/airdrops', pathname):
          yield put(actions.modules.profile.fetchUserDataLoading())
          yield put(actions.modules.profile.fetchUser())
          yield put(actions.modules.profile.fetchUserCampaigns())
          break
        case contains('/swap/history', pathname):
          yield put(actions.components.exchangeHistory.clearTrades())
          yield put(actions.components.exchangeHistory.fetchNextPage())
          break
        case contains('/borrow', pathname):
          yield put(actions.components.borrow.fetchUserBorrowHistory())
          yield put(actions.components.borrow.fetchOffers())
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
