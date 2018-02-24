import { call, takeLatest, put } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'
import * as sagas from '../../sagas.js'
import { askSecondPasswordEnhancer } from 'services/SagaService'

export const sendEther = function * (action) {
  try {
    const saga = askSecondPasswordEnhancer(sagas.core.data.ethereum.signAndPublish)
    yield call(saga, action.payload)
    yield put(actions.form.destroy('sendEther'))
    yield put(actions.modals.closeModal())
    yield put(actions.router.push('/eth/transactions'))
    yield put(actions.alerts.displaySuccess('Your transaction is being confirmed'))
  } catch (e) {
    yield put(actions.alerts.displayError('Your transaction could not be sent.'))
  }
}

export default function * () {
  yield takeLatest(AT.SEND_ETHER, sendEther)
}
