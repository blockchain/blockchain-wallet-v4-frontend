import { call, takeLatest, put } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actions from '../../actions.js'
import { askSecondPasswordEnhancer } from 'services/SagaService'

export default ({ coreSagas }) => {
  const sendEther = function * (action) {
    try {
      const saga = askSecondPasswordEnhancer(coreSagas.data.ethereum.signAndPublish)
      yield call(saga, action.payload)
      yield put(actions.modals.closeModal())
      yield put(actions.form.destroy('sendEther'))
      yield put(actions.router.push('/eth/transactions'))
      yield put(actions.alerts.displaySuccess('Your transaction is being confirmed'))
    } catch (e) {
      yield put(actions.alerts.displayError('Your transaction could not be sent.'))
    }
  }

  return function * () {
    yield takeLatest(AT.SEND_ETHER, sendEther)
  }
}
