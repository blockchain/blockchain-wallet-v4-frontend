import { takeEvery, put, call } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'
import * as sagas from '../../sagas.js'
import { askSecondPasswordEnhancer } from 'services/SagaService'

export const sendBch = function * (action) {
  try {
    const saga = askSecondPasswordEnhancer(sagas.core.data.bch.signAndPublish)
    yield call(saga, action.payload)
    yield put(actions.modals.closeModal())
    yield put(actions.form.destroy('sendBch'))
    yield put(actions.router.push('/bch/transactions'))
    yield put(actions.alerts.displaySuccess('Your transaction is being confirmed'))
  } catch (e) {
    console.log(e)
    yield put(actions.alerts.displayError('Your transaction could not be sent.'))
  }
}

export default function * () {
  yield takeEvery(AT.SEND_BCH, sendBch)
}
