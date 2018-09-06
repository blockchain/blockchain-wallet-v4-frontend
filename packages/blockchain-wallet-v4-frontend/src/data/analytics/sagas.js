import { call, select, put, fork, join, take } from 'redux-saga/effects'
import * as selectors from '../selectors.js'
import * as actions from '../actions'
import * as actionTypes from '../actionTypes'
import { Remote } from 'blockchain-wallet-v4/src'
import { path, toLower, test } from 'ramda'

export const logLocation = 'analytics/sagas'

export default ({ api, coreSagas }) => {
  const getEthBalance = function*() {
    try {
      const ethBalanceR = yield select(selectors.core.data.ethereum.getBalance)
      if (!Remote.Success.is(ethBalanceR)) {
        yield take(actionTypes.core.data.ethereum.FETCH_ETHEREUM_DATA_SUCCESS)
        const ethBalanceR = yield select(selectors.core.data.ethereum.getBalance)
        return ethBalanceR.getOrElse(0)
      }
      return ethBalanceR.getOrElse(0)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'getEthbalance', e))
    }
  }

  const getBtcBalance = function* () {
    try {
      const btcBalanceR = yield select(selectors.core.data.bitcoin.getBalance)
      if (!Remote.Success.is(btcBalanceR)) {
        yield take(actionTypes.core.data.bitcoin.FETCH_BITCOIN_DATA_SUCCESS)
        const btcBalanceR = yield select(selectors.core.data.bitcoin.getBalance)
        return btcBalanceR.getOrElse(0)
      }
      return btcBalanceR.getOrElse(0)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'getBtcBalance', e))
    }
  }

  const getBchBalance = function* () {
    try {
      const bchBalanceR = yield select(selectors.core.data.bch.getBalance)
      if (!Remote.Success.is(bchBalanceR)) {
        yield take(actionTypes.core.data.bch.FETCH_BCH_DATA_SUCCESS)
        const bchBalanceR = yield select(selectors.core.data.bch.getBalance)
        return bchBalanceR.getOrElse(0)
      }
      return bchBalanceR.getOrElse(0)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'getBchBalance', e))
    }
  }

  const reportBalanceStats = function*() {
    try {
      const ethT = yield fork(getEthBalance)
      const btcT = yield fork(getBtcBalance)
      const bchT = yield fork(getBchBalance)
      const btcBalance = yield join(btcT)
      const ethBalance = yield join(ethT)
      const bchBalance = yield join(bchT)

      yield call(api.incrementCurrencyUsageStats, btcBalance, ethBalance, bchBalance)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'reportBalanceStats', e))
    }
  }

  const logLeftNavClick = function*(payload) {
    const { event } = payload
    try {
      event.persist()
      const text = toLower(path(['target', 'textContent'], event))

      if (test(/dashboard/, text)) return yield call(api.logClick, 'dashboard')
      if (test(/^bitcoin$/, text)) return yield call(api.logClick, 'btc')
      if (test(/ether/, text)) return yield call(api.logClick, 'eth')
      if (test(/cash/, text)) return yield call(api.logClick, 'bch')
      if (test(/(buy|sell)/, text)) return yield call(api.logClick, 'buysell')
      if (test(/exchange/, text)) return yield call(api.logClick, 'exchange')
      if (test(/security/, text)) return yield call(api.logClick, 'security')
      if (test(/settings/, text)) return yield call(api.logClick, 'settings')
      if (test(/general/, text)) return yield call(api.logClick, 'settings_general')
      if (test(/profile/, text)) return yield call(api.logClick, 'settings_profile')
      if (test(/preferences/, text)) return yield call(api.logClick, 'settings_preferences')
      if (test(/wallets/, text)) return yield call(api.logClick, 'settings_wallets')
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'logLeftNavClick', e))
    }
  }

  return {
    logLeftNavClick,
    reportBalanceStats
  }
}
