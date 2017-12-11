import { call, put, takeEvery } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'
import * as sagas from '../../sagas.js'

const initTickerEther = function * (action) {
  try {
    yield call(sagas.core.data.ethereum.startRates)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not init ticker ether.'))
  }
}

export default function * () {
  yield takeEvery(AT.INIT_TICKER_ETHER, initTickerEther)
}
