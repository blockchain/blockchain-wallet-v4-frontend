import { takeEvery, put, call } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../actions.js'
import * as sagas from '../sagas.js'

const initWalletOptions = function * (action) {
  try {
    yield call(sagas.core.walletOptions.fetchWalletOptions)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch options.'))
  }
}

export default function * () {
  yield takeEvery(AT.INIT_WALLET_OPTIONS, initWalletOptions)
}
