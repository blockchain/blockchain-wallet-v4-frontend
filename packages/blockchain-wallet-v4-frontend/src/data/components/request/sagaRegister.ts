import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas, networks }) => {
  const requestSagas = sagas({ api, coreSagas, networks })

  return function * requestSaga() {
    yield takeLatest(AT.GET_NEXT_ADDRESS, requestSagas.getNextAddress)
  }
}
