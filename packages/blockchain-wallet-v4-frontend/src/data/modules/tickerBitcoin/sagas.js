import { call, put, takeEvery } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'
import * as sagas from '../../sagas.js'

const initTickerBitcoin = function * (action) {
  try {
    yield call(sagas.core.data.bitcoin.startRates)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not init ticker bitcoin.'))
  }
}

export default function * () {
  yield takeEvery(AT.INIT_TICKER_BITCOIN, initTickerBitcoin)
}
