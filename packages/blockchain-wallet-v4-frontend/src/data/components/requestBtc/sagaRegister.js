import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default () => {
  const requestBtcSagas = sagas()

  return function * () {
    yield takeLatest(AT.REQUEST_BTC_FIRST_STEP_SUBMIT_CLICKED, requestBtcSagas.firstStepSubmitClicked)
  }
}
