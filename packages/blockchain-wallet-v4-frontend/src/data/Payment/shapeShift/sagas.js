import { takeEvery, put, call, select } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'
import * as sagas from '../../sagas.js'
import * as selectors from '../../selectors.js'

export const initShapeShift = function * (action) {
  try {
    yield call(sagas.core.data.bitcoin.fetchFee)
    yield call(sagas.core.data.ethereum.fetchFee)
    const index = yield select(selectors.core.wallet.getDefaultAccountIndex)
    yield call(sagas.core.data.bitcoin.fetchUnspent, index, undefined)
    const feePerByte = yield select(selectors.core.data.bitcoin.getFeeRegular)
    yield call(sagas.core.data.bitcoin.refreshEffectiveBalance, { feePerByte })
  } catch (e) {
    if (e !== 'No free outputs to spend') {
      yield put(actions.alerts.displayError('Could not init shapeshift.'))
    }
  }
}

export const createOrder = function * (action) {
  try {
    yield call(sagas.core.data.shapeShift.createOrder, action.payload)
  } catch (e) {
    yield put(actions.alerts.displayError('Cannot create shapeShift order'))
  }
}

export default function * () {
  yield takeEvery(AT.INIT_SHAPESHIFT, initShapeShift)
  yield takeEvery(AT.CREATE_ORDER, createOrder)
}
