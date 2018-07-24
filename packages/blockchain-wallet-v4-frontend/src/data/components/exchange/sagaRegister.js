import { takeEvery, takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import { actionTypes } from 'redux-form'
import sagas from './sagas'

export default ({ api, coreSagas }) => {
  const exchangeSagas = sagas({ api, coreSagas })

  return function * () {
    yield takeLatest(AT.EXCHANGE_FIRST_STEP_INITIALIZED, exchangeSagas.firstStepInitialized)
    yield takeLatest(AT.EXCHANGE_FIRST_STEP_SWAP_CLICKED, exchangeSagas.swapClicked)
    yield takeLatest(AT.EXCHANGE_FIRST_STEP_MINIMUM_CLICKED, exchangeSagas.minimumClicked)
    yield takeLatest(AT.EXCHANGE_FIRST_STEP_MAXIMUM_CLICKED, exchangeSagas.maximumClicked)
    yield takeLatest(AT.EXCHANGE_FIRST_STEP_SUBMIT_CLICKED, exchangeSagas.firstStepSubmitClicked)
    yield takeLatest(AT.EXCHANGE_THIRD_STEP_INITIALIZED, exchangeSagas.thirdStepInitialized)
    yield takeLatest(AT.EXCHANGE_SECOND_STEP_SUBMIT_CLICKED, exchangeSagas.secondStepSubmitClicked)
    yield takeLatest(AT.EXCHANGE_US_STATE_REGISTERED, exchangeSagas.usStateRegistered)
    yield takeLatest(AT.EXCHANGE_DESTROYED, exchangeSagas.destroyed)
    yield takeEvery(actionTypes.CHANGE, exchangeSagas.change)
  }
}
