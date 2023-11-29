import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas, networks }) => {
  const requestSagas = sagas({ api, coreSagas, networks })

  return function* requestSaga() {
    yield takeLatest(AT.GET_NEXT_ADDRESS, requestSagas.getNextAddress)
    yield takeLatest(
      AT.CHECK_CAN_USER_PROCEED_WITH_ADDRESS,
      requestSagas.checkIsUserAllowedToProceedWithRequest
    )
  }
}
