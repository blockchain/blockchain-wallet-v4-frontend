import { takeEvery, put, call } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'
import { askSecondPasswordEnhancer } from 'services/SagaService'

export default ({ coreSagas }) => {
  const sendBitcoin = function * (action) {
    try {
      const saga = askSecondPasswordEnhancer(coreSagas.data.bitcoin.signAndPublish)
      yield call(saga, action.payload)
      yield put(actions.modals.closeModal())
      yield put(actions.form.destroy('sendBitcoin'))
      yield put(actions.router.push('/btc/transactions'))
      yield put(actions.alerts.displaySuccess('Your transaction is being confirmed'))
    } catch (e) {
      yield put(actions.alerts.displayError('Your transaction could not be sent.'))
    }
  }

  return function * () {
    yield takeEvery(AT.SEND_BITCOIN, sendBitcoin)
  }
}
