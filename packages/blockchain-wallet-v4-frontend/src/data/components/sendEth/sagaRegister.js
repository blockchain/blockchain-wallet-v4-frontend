import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import { actionTypes } from 'redux-form'
import sagas from './sagas'

export default ({ coreSagas }) => {
  const sendEthSagas = sagas({ coreSagas })

  return function * () {
    yield takeLatest(AT.SEND_ETH_INITIALIZED, sendEthSagas.initialized)
    yield takeLatest(AT.SEND_ETH_DESTROYED, sendEthSagas.destroyed)
    yield takeLatest(AT.SEND_ETH_FIRST_STEP_SUBMIT_CLICKED, sendEthSagas.firstStepSubmitClicked)
    yield takeLatest(AT.SEND_ETH_FIRST_STEP_MAXIMUM_AMOUNT_CLICKED, sendEthSagas.maximumAmountClicked)
    yield takeLatest(AT.SEND_ETH_SECOND_STEP_SUBMIT_CLICKED, sendEthSagas.secondStepSubmitClicked)
    yield takeLatest(actionTypes.CHANGE, sendEthSagas.formChanged)
  }
}
