import { call, put } from 'redux-saga/effects'
import { prop, equals } from 'ramda'

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

  const logKycEvent = function*({ payload }) {
    try {
      const { event } = payload
      yield call(api.logKycEvent, event)
    } catch (e) {
      yield put(actions.logs.logErrorMessage(logLocation, 'logKycEvent', e))
    }
  }

  const logExchangeEvent = function*({ payload }) {
    try {
      const { event } = payload
      yield call(api.logExchangeEvent, event)
    } catch (e) {
      yield put(
        actions.logs.logErrorMessage(logLocation, 'logExchangeEvent', e)
      )
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
    logKycEvent,
    logExchangeEvent,
    logSfoxDropoff,
    logLockboxSetup,
    reportBalanceStats
  }
}
