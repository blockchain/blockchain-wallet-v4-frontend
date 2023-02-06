import { pathOr } from 'ramda'
import { put, select, take } from 'redux-saga/effects'

import { Remote } from '@core'
import { actions, actionTypes, selectors } from 'data'

export const logLocation = 'balances'
export const balancePath = ['payload', 'info', 'final_balance']

export const fetchBalances = function* () {
  yield put(actions.core.data.bch.fetchData())
  yield put(actions.core.data.btc.fetchData())
  yield put(actions.core.data.eth.fetchData())
  yield put(actions.core.data.coins.fetchUnifiedBalances())
  yield put(actions.components.refresh.refreshRates())
  yield put(actions.custodial.fetchRecentSwapTxs())
}

export const getBtcBalance = function* () {
  try {
    const btcBalanceR = yield select(selectors.core.data.btc.getBalance)
    if (!Remote.Success.is(btcBalanceR)) {
      const btcData = yield take([
        actionTypes.core.data.btc.FETCH_BTC_DATA_SUCCESS,
        actionTypes.core.data.btc.FETCH_BTC_DATA_FAILURE
      ])
      return pathOr(0, balancePath, btcData)
    }
    return btcBalanceR.getOrElse(0)
  } catch (e) {
    yield put(actions.logs.logErrorMessage(logLocation, 'getBtcBalance', e))
  }
}

export const getBchBalance = function* () {
  try {
    const bchBalanceR = yield select(selectors.core.data.bch.getBalance)
    if (!Remote.Success.is(bchBalanceR)) {
      const bchData = yield take([
        actionTypes.core.data.bch.FETCH_BCH_DATA_SUCCESS,
        actionTypes.core.data.bch.FETCH_BCH_DATA_FAILURE
      ])
      return pathOr(0, balancePath, bchData)
    }
    return bchBalanceR.getOrElse(0)
  } catch (e) {
    yield put(actions.logs.logErrorMessage(logLocation, 'getBchBalance', e))
  }
}
