import { actionTypes } from 'redux-form'
import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas, networks }) => {
  const sendEthSagas = sagas({ api, coreSagas, networks })

  return function * sendEthSaga() {
    yield takeLatest(AT.RETRY_SEND_ETH, sendEthSagas.retrySendEth)
    yield takeLatest(AT.SEND_ETH_INITIALIZED, sendEthSagas.initialized)
    yield takeLatest(AT.SEND_ETH_DESTROYED, sendEthSagas.destroyed)
    yield takeLatest(
      AT.SEND_ETH_FIRST_STEP_SUBMIT_CLICKED,
      sendEthSagas.firstStepSubmitClicked
    )
    yield takeLatest(
      AT.SEND_ETH_FIRST_STEP_MAXIMUM_AMOUNT_CLICKED,
      sendEthSagas.maximumAmountClicked
    )
    yield takeLatest(
      AT.SEND_ETH_SECOND_STEP_SUBMIT_CLICKED,
      sendEthSagas.secondStepSubmitClicked
    )
    yield takeLatest(
      // @ts-ignore
      AT.SEND_ETH_CHECK_IS_CONTRACT,
      sendEthSagas.checkIsContract
    )
    yield takeLatest(actionTypes.CHANGE, sendEthSagas.formChanged)
    yield takeLatest(
      AT.SEND_ETH_FIRST_STEP_REGULAR_FEE_CLICKED,
      sendEthSagas.regularFeeClicked
    )
    yield takeLatest(
      AT.SEND_ETH_FIRST_STEP_PRIORITY_FEE_CLICKED,
      sendEthSagas.priorityFeeClicked
    )
    yield takeLatest(
      AT.SEND_ETH_FIRST_STEP_MINIMUM_FEE_CLICKED,
      sendEthSagas.minimumFeeClicked
    )
    yield takeLatest(
      AT.SEND_ETH_FIRST_STEP_MAXIMUM_FEE_CLICKED,
      sendEthSagas.maximumFeeClicked
    )
  }
}
