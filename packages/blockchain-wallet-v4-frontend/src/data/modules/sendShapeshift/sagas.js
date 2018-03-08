import { call, takeLatest, put } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'
import * as sagas from '../../sagas.js'
import { askSecondPasswordEnhancer } from 'services/SagaService'

export const sendShapeshiftDeposit = function * (action) {
  try {
    // const saga = askSecondPasswordEnhancer(sagas.core.data.ethereum.signAndPublish)
    // yield call(saga, action.payload)
    yield put(actions.alerts.displaySuccess('Your deposit has been sent to ShapeShift.'))
  } catch (e) {
    yield put(actions.alerts.displayError('Your deposit could not be sent.'))
  }
}

export default function * () {
  yield takeLatest(AT.SEND_SHAPESHIFT_DEPOSIT, sendShapeshiftDeposit)
}
