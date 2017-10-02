import { takeEvery, call, put } from 'redux-saga/effects'
import * as actions from './actions'
import * as AT from './actionTypes'

export const walletOptionsSaga = ({ api } = {}) => {
  const fetchWalletOptions = function * (action) {
    try {
      let response = yield call(api.getWalletOptions)
      yield put(actions.fetchWalletOptionsSuccess(response))
    } catch (error) {
      yield put(actions.fetchWalletOptionsError(error))
    }
  }

  return function * () {
    yield takeEvery(AT.FETCH_WALLET_OPTIONS, fetchWalletOptions)
  }
}
