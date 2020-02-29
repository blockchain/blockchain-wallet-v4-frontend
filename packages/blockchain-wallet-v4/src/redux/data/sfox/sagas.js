import * as A from './actions'
import * as buySellSelectors from '../../kvStore/buySell/selectors'
import { apply, call, put, select } from 'redux-saga/effects'
import { path } from 'ramda'
import { sfoxService } from '../../../exchange/service'
import ExchangeDelegate from '../../../exchange/delegate'

let sfox

export default ({ api }) => {
  const refreshSFOX = function * () {
    const state = yield select()
    const delegate = new ExchangeDelegate(state, api, 'sfox')
    const value = yield select(buySellSelectors.getMetadata)
    const walletOptions = state.walletOptionsPath.data
    sfox = sfoxService.refresh(value, delegate, walletOptions)
  }

  const init = function * () {
    try {
      const value = yield select(buySellSelectors.getMetadata)
      if (!path(['data', 'value', 'sfox', 'account_token'], value)) return
      yield call(refreshSFOX)
    } catch (e) {
      throw new Error(e)
    }
  }

  const fetchProfile = function * () {
    try {
      yield put(A.fetchProfileLoading())
      const profile = yield apply(sfox, sfox.fetchProfile)
      yield put(A.fetchProfileSuccess(profile))
    } catch (e) {
      yield put(A.fetchProfileFailure(e))
    }
  }

  const refetchProfile = function * () {
    const profile = yield apply(sfox, sfox.fetchProfile)
    yield put(A.fetchProfileSuccess(profile))
  }

  const fetchTrades = function * () {
    try {
      yield put(A.fetchTradesLoading())

      const kvTrades = yield select(buySellSelectors.getSfoxTrades)
      const numberOfTrades = kvTrades.getOrElse([]).length
      const trades = yield apply(sfox, sfox.getTrades, [numberOfTrades])
      yield put(A.fetchTradesSuccess(trades))
    } catch (e) {
      yield put(A.fetchTradesFailure(e))
    }
  }

  const fetchSfoxAccounts = function * () {
    try {
      yield call(refreshSFOX)
      yield put(A.fetchSfoxAccountsLoading())
      const methods = yield apply(sfox, sfox.getBuyMethods)
      const accounts = yield apply(sfox, methods.ach.getAccounts)
      yield put(A.fetchSfoxAccountsSuccess(accounts))
    } catch (e) {
      yield put(A.fetchSfoxAccountsFailure(e))
    }
  }

  const resetProfile = function * () {
    yield put(A.resetProfile())
  }

  return {
    init,
    fetchSfoxAccounts,
    fetchProfile,
    fetchTrades,
    resetProfile,
    refetchProfile
  }
}
