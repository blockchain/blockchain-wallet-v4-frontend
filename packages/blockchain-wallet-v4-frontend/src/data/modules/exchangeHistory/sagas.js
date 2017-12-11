import { call, put, select, takeEvery } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as S from './selectors'
import * as actions from '../../actions.js'
import * as sagas from '../../sagas.js'

const initExchangeHistory = function * (action) {
  try {
    yield call(sagas.core.kvStore.shapeShift.fetchShapeShift)
    const { page } = action.payload
    const depositAddresses = yield select(S.getDepositAddresses, page)
    yield call(sagas.core.data.shapeShift.getTradesStatus, depositAddresses)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not fetch shapeshift trade statuses.'))
  }
}

export default function * () {
  yield takeEvery(AT.INIT_EXCHANGE_HISTORY, initExchangeHistory)
}
