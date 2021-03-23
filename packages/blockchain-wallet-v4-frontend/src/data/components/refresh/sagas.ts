import { contains } from 'ramda'
import { call, put, select } from 'redux-saga/effects'

import { actions, selectors } from 'data'

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
      yield put(actions.core.data.eth.fetchErc20Data('usdt'))
      yield put(actions.core.data.eth.fetchErc20Data('wdgld'))
      yield put(actions.core.data.eth.fetchErc20Data('yfi'))
      yield put(actions.core.data.eth.fetchErc20Data('aave'))
      yield put(actions.components.interest.fetchInterestBalance())
      yield put(actions.components.simpleBuy.fetchSBBalances())
      yield put(actions.components.simpleBuy.fetchSBOrders())
      // Prices (new approach)
      yield put(actions.prices.fetchCoinPrices())
      // Rates
      // TODO: remove all of this
      yield put(actions.core.data.bch.fetchRates())
      yield put(actions.core.data.btc.fetchRates())
      yield put(actions.core.data.eth.fetchRates())
      yield put(actions.core.data.xlm.fetchRates())
      yield put(actions.core.data.dot.fetchRates())
      yield put(actions.core.data.eth.fetchErc20Rates('pax'))
      yield put(actions.core.data.eth.fetchErc20Rates('usdt'))
      yield put(actions.core.data.eth.fetchErc20Rates('wdgld'))
      yield put(actions.core.data.eth.fetchErc20Rates('aave'))
      yield put(actions.core.data.eth.fetchErc20Rates('yfi'))
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
        case contains('/dot/transactions', pathname):
          yield call(refreshDotTransactions)
          break
        case contains('/aave/transactions', pathname):
          yield call(refreshErc20Transactions, 'aave')
          break
        case contains('/yfi/transactions', pathname):
          yield call(refreshErc20Transactions, 'yfi')
          break
        case contains('/usd-d/transactions', pathname):
          yield call(refreshErc20Transactions, 'pax')
          break
        case contains('/usdt/transactions', pathname):
          yield call(refreshErc20Transactions, 'usdt')
          break
        case contains('/wdgld/transactions', pathname):
          yield call(refreshErc20Transactions, 'wdgld')
          break
        case contains('/xlm/transactions', pathname):
          yield call(refreshXlmTransactions)
          break
        case contains('/algo/transactions', pathname):
          yield call(refreshAlgoTransactions)
          break
        case contains('/eur/transactions', pathname):
          yield put(actions.core.data.fiat.fetchTransactions('EUR', true))
          break
        case contains('/gbp/transactions', pathname):
          yield put(actions.core.data.fiat.fetchTransactions('GBP', true))
          break
        case contains('/usd/transactions', pathname):
          yield put(actions.core.data.fiat.fetchTransactions('USD', true))
          break
        case contains('/lockbox/', pathname):
          yield put(
            actions.components.lockbox.initializeDashboard(
              pathname.split('/')[3]
            )
          )
          break
        case contains('profile', pathname):
        case contains('/airdrops', pathname):
          yield put(actions.modules.profile.fetchUserDataLoading())
          yield put(actions.modules.profile.fetchUser())
          yield put(actions.modules.profile.fetchUserCampaigns())
          break
        case contains('/settings/general', pathname):
          yield put(actions.components.simpleBuy.fetchSBCards(true))
          break
        case contains('/borrow', pathname):
          yield put(actions.components.borrow.fetchUserBorrowHistory())
          yield put(actions.components.borrow.fetchBorrowOffers())
          break
        default:
          yield put(actions.core.data.bch.fetchTransactions('', true))
          yield put(actions.core.data.btc.fetchTransactions('', true))
          yield put(actions.core.data.eth.fetchTransactions(null, true))
          yield put(actions.core.data.xlm.fetchTransactions('', true))
      }
    } catch (e) {
      // eslint-disable-next-line
      console.log(e)
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
    const onlyShow = yield select(
      selectors.components.bchTransactions.selectOnlyShow
    )
    yield put(actions.core.data.bch.fetchTransactions(onlyShow, true))
  }

  const refreshBtcTransactions = function * () {
    const onlyShow = yield select(
      selectors.components.btcTransactions.selectOnlyShow
    )
    yield put(actions.core.data.btc.fetchTransactions(onlyShow, true))
  }

  const refreshDotTransactions = function * () {
    yield put(actions.core.data.dot.fetchTransactions(null, true))
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

  const refreshAlgoTransactions = function * () {
    yield put(actions.core.data.algo.fetchTransactions(null, true))
  }

  return {
    refreshClicked,
    refreshBchTransactions,
    refreshBtcTransactions
  }
}
