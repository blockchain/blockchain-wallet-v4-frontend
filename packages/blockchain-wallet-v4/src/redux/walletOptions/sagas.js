import { call, put } from 'redux-saga/effects'
import * as actions from './actions'

export const walletOptionsSaga = ({ api } = {}) => {
  const fetchWalletOptions = function * (action) {
    const response = yield call(api.getWalletOptions)
    yield put(actions.setWalletOptions(response))
  }

  return {
    fetchWalletOptions
  }
}
