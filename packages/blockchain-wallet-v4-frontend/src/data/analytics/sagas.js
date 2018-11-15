import { call, put } from 'redux-saga/effects'
import { test, prop, equals } from 'ramda'

import { actions } from 'data'
import {
  LAYOUT_WALLET_HEADER_FAQ_CLICKED,
  LAYOUT_WALLET_HEADER_WHATSNEW_CLICKED
} from '../components/layoutWallet/actionTypes'
import { getAllBalances } from 'data/balance/sagas'

export const logLocation = 'analytics/sagas'
export const balancePath = ['payload', 'info', 'final_balance']

export default ({ api }) => {
  const reportBalanceStats = function*() {
    try {
      const { btc, eth, bch, xlm } = yield call(getAllBalances)
      yield call(api.incrementCurrencyUsageStats, btc, eth, bch, xlm)
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'reportBalanceStats', e)
      )
    }
  }

  const logLeftNavClick = function*({ payload }) {
    try {
      const { text } = payload

      if (test(/dashboard/, text)) return yield call(api.logClick, 'dashboard')
      if (test(/^bitcoin$/, text)) return yield call(api.logClick, 'btc')
      if (test(/ether/, text)) return yield call(api.logClick, 'eth')
      if (test(/cash/, text)) return yield call(api.logClick, 'bch')
      if (test(/stellar/, text)) return yield call(api.logClick, 'xlm')
      if (test(/(buy|sell)/, text)) return yield call(api.logClick, 'buysell')
      if (test(/exchange/, text)) return yield call(api.logClick, 'exchange')
      if (test(/lockbox/, text)) return yield call(api.logClick, 'lockbox')
      if (test(/security/, text)) return yield call(api.logClick, 'security')
      if (test(/settings/, text)) return yield call(api.logClick, 'settings')
      if (test(/general/, text))
        return yield call(api.logClick, 'settings_general')
      if (test(/profile/, text))
        return yield call(api.logClick, 'settings_profile')
      if (test(/preferences/, text))
        return yield call(api.logClick, 'settings_preferences')
      if (test(/wallets/, text))
        return yield call(api.logClick, 'settings_wallets')
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'logLeftNavClick', e))
    }
  }

  const logClick = function*({ type, payload }) {
    try {
      if (equals(type, LAYOUT_WALLET_HEADER_FAQ_CLICKED))
        return yield call(api.logClick, 'faq')
      if (equals(type, LAYOUT_WALLET_HEADER_WHATSNEW_CLICKED))
        return yield call(api.logClick, 'whatsnew')

      const { name } = payload
      yield call(api.logClick, name)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'logClick', e))
    }
  }

  const logSfoxDropoff = function*(action) {
    const { payload } = action
    try {
      yield call(api.logSfoxDropoff, prop('step', payload))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'logSfoxDropoff', e))
    }
  }

  const logLockboxSetup = function*(action) {
    const { payload } = action
    try {
      yield call(api.logLockboxSetup, prop('step', payload))
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'logLockboxSetup', e))
    }
  }

  return {
    logClick,
    logSfoxDropoff,
    logLeftNavClick,
    logLockboxSetup,
    reportBalanceStats
  }
}
