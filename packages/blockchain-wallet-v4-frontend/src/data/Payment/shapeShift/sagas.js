import { takeEvery, takeLatest, put, call, select } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'
import * as sagas from '../../sagas.js'

export const createOrder = function * (action) {
  try {
    yield call(sagas.core.data.shapeShift.createOrder, action.payload)
  } catch (e) {
    yield put(actions.alerts.displayError('Could not create order.'))
  }
}

export default function * () {
  yield takeEvery(AT.CREATE_ORDER, createOrder)
}
