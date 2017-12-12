import { call, put, takeLatest } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import * as AT from './actionTypes'
import * as actions from '../../actions'
import * as sagas from '../../sagas'

export const init = function * (action) {
  try {
    const { coin } = action.payload
    switch (coin) {
      case 'ETH':
        yield call(sagas.core.data.ethereum.startRates)
        break
      default:
        yield call(sagas.core.data.bitcoin.startRates)
    }
    yield call(delay, 3000)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not init coin display.'))
  }
}
export default function * () {
  yield takeLatest(AT.INIT_FIAT_DISPLAY, init)
}
