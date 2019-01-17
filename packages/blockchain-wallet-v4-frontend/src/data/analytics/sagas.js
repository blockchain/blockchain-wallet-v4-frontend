import { call, put } from 'redux-saga/effects'

import { actions } from 'data'
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

  return {
    reportBalanceStats
  }
}
