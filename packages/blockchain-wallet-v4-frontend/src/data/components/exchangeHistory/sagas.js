import { takeEvery, put, call } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'
import * as sagas from '../../sagas.js'

const initExchangeHistory = function * (action) {
  try {
    const { addresses } = action.payload
    yield call(sagas.core.data.shapeShift.getTradesStatus, addresses)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch shapeshift trade statuses.'))
  }
}

export default function * () {
  yield takeEvery(AT.INIT_EXCHANGE_HISTORY, initExchangeHistory)
}
