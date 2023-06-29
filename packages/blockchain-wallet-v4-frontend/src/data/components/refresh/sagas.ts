import { contains, toUpper } from 'ramda'
import { call, put, select } from 'redux-saga/effects'

import { actions, selectors } from 'data'

export default () => {
  const refreshBchTransactions = function* () {
    const onlyShow = yield select(selectors.components.bchTransactions.selectOnlyShow)
    yield put(actions.core.data.bch.fetchTransactions(onlyShow, true))
  }

  const refreshBtcTransactions = function* () {
    const onlyShow = yield select(selectors.components.btcTransactions.selectOnlyShow)
    yield put(actions.core.data.btc.fetchTransactions(onlyShow, true))
  }

  const refreshEthTransactions = function* () {
    yield put(actions.core.data.eth.fetchTransactions(null, true))
  }

  const refreshErc20Transactions = function* (coin) {
    yield put(actions.core.data.eth.fetchErc20Transactions(coin, true))
  }

  const refreshCoinTransactions = function* (coin) {
    yield put(actions.core.data.coins.fetchTransactions(coin, true))
  }

  const refreshXlmTransactions = function* () {
    yield put(actions.core.data.xlm.fetchTransactions(null, true))
  }

  const refreshRates = function* () {
    yield put(actions.core.data.coins.fetchCoinsRates())
  }

  const refreshClicked = function* () {
    try {
      // User
      yield put(actions.modules.profile.fetchUser())
      // Data (balance)
      yield put(actions.core.data.bch.fetchData())
      yield put(actions.core.data.btc.fetchData())
      yield put(actions.core.data.eth.fetchData())
      yield put(actions.core.data.xlm.fetchData())
      yield put(actions.core.data.eth.fetchErc20Data())
      yield put(actions.components.interest.fetchRewardsBalance())
      yield put(actions.components.interest.fetchStakingBalance())
      yield put(actions.components.interest.fetchActiveRewardsBalance())
      yield put(actions.components.buySell.fetchBalance({}))
      yield put(actions.components.buySell.fetchOrders())
      yield put(actions.components.dex.fetchUserEligibility())
      // TODO: SELF_CUSTODY, remove
      const stxEligibility = selectors.coins.getStxSelfCustodyAvailability(yield select())
      if (stxEligibility) {
        yield put(actions.core.data.coins.fetchData())
      }
      // Prices (new approach)
      yield put(actions.prices.fetchCoinPrices())
      // Rates
      yield put(actions.components.refresh.refreshRates())
      // Custodial Swaps
      yield put(actions.custodial.fetchRecentSwapTxs())

      const pathname = (yield select(selectors.router.getPathname))?.toLowerCase()
      const maybeCoin = toUpper(pathname.split('/')[2] || '')

      switch (true) {
        case contains('coins/BCH', pathname):
          yield call(refreshBchTransactions)
          break
        case contains('coins/BTC', pathname):
          yield call(refreshBtcTransactions)
          break
        case contains('coins/ETH', pathname):
          yield call(refreshEthTransactions)
          break
        case contains('coins/XLM', pathname):
          yield call(refreshXlmTransactions)
          break
        case selectors.core.data.coins.getErc20Coins().includes(maybeCoin):
          yield call(refreshErc20Transactions, pathname.split('/')[1])
          break
        case selectors.core.data.coins.getDynamicSelfCustodyCoins().includes(maybeCoin):
        case selectors.core.data.coins.getCustodialCoins().includes(maybeCoin):
          yield call(refreshCoinTransactions, maybeCoin)
          break
        case contains('coins/EUR', pathname):
          yield put(actions.core.data.fiat.fetchTransactions('EUR', true))
          break
        case contains('coins/GBP', pathname):
          yield put(actions.core.data.fiat.fetchTransactions('GBP', true))
          break
        case contains('coins/USD', pathname):
          yield put(actions.core.data.fiat.fetchTransactions('USD', true))
          break
        case contains('profile', pathname):
        case contains('/airdrops', pathname):
          yield put(actions.modules.profile.fetchUserDataLoading())
          yield put(actions.modules.profile.fetchUser())
          yield put(actions.modules.profile.fetchUserCampaigns())
          break
        case contains('/debit-card', pathname):
          yield put(actions.components.debitCard.getCurrentCardAccount())
          yield put(actions.components.debitCard.getCardTransactions({ limit: 4 }))
          break
        case contains('/settings/general', pathname):
          yield put(actions.components.buySell.fetchCards(true))
          break
        default:
      }
    } catch (e) {
      // eslint-disable-next-line
      console.log(e)
      yield put(
        actions.logs.logErrorMessage('components/refresh/sagas', 'refresh', 'Refresh failed.')
      )
    }
  }

  return {
    refreshBchTransactions,
    refreshBtcTransactions,
    refreshClicked,
    refreshRates
  }
}
