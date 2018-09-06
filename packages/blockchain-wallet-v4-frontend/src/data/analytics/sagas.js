import { call, select, put, fork, join } from 'redux-saga/effects'
import * as selectors from '../selectors.js'
import * as actions from '../actions'

export const logLocation = 'analytics/sagas'

export default ({ api, coreSagas }) => {
  const getEthBalance = function*() {
    try {
      const ethBalanceR = yield select(selectors.core.data.ethereum.getBalance)
      return ethBalanceR.getOrElse(0)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'getEthbalance', e))
    }
  }
  const getBtcBalance = function* () {
    try {
      const btcBalanceR = yield select(selectors.core.data.bitcoin.getBalance)
      return btcBalanceR.getOrElse(0)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'getBtcBalance', e))
    }
  }
  const getBchBalance = function* () {
    try {
      const bchBalanceR = yield select(selectors.core.data.bch.getBalance)
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

  return {
    reportBalanceStats
  }
}
