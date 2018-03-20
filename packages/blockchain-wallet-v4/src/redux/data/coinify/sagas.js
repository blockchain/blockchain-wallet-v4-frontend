import ExchangeDelegate from '../../../exchange/delegate'
import { apply, call, put, select } from 'redux-saga/effects'
import * as S from './selectors'
import * as A from './actions'
import * as buySellSelectors from '../../kvStore/buySell/selectors'
import * as buySellA from '../../kvStore/buySell/actions'

export const coinifySaga = ({ api, coinifyService } = {}) => {
  const getCoinify = function * () {
    const state = yield select()
    const delegate = new ExchangeDelegate(state, api)
    const value = yield select(buySellSelectors.getMetadata)
    let coinify = yield apply(coinifyService, coinifyService.refresh, [value, delegate])
    yield apply(coinify, coinify.profile.fetch)
    yield put(A.fetchProfileSuccess(coinify))
    return coinify
  }

  const signup = function * () {
    const countryCode = 'FR' // TODO should be passed in
    const fiatCurrency = 'EUR' // TODO should be passed in
    try {
      const coinify = yield call(getCoinify)
      const signupResponse = yield apply(coinify, coinify.signup, [countryCode, fiatCurrency]) // TODO countryCode and fiatCurrency passed in as args

      yield put(buySellA.coinifySetProfileBuySell(signupResponse))
      yield put(A.coinifySetToken(signupResponse))
    } catch (e) {
      yield put(A.coinifySignupFailure(e))
    }
  }

  return {
    signup
  }
}
