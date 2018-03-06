import { takeEvery, put, call } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'
import * as sagas from '../../sagas.js'
import { askSecondPasswordEnhancer } from 'services/SagaService'

export const sendBitcoin = function * (action) {
  try {
    const saga = askSecondPasswordEnhancer(sagas.core.data.bitcoin.signAndPublish)
    yield call(saga, action.payload)
    yield put(actions.modals.closeModal())
    yield put(actions.form.destroy('sendBitcoin'))
    yield put(actions.router.push('/btc/transactions'))
    yield put(actions.alerts.displaySuccess('Your transaction is being confirmed'))
  } catch (e) {
    yield put(actions.alerts.displayError('Your transaction could not be sent.'))
  }
}

export default function * () {
  yield takeEvery(AT.SEND_BITCOIN, sendBitcoin)
}
