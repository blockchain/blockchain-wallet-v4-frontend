import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ coreSagas }) => {
  const signMessageSagas = sagas({ coreSagas })

  return function * signMessageSaga() {
    yield takeLatest(AT.SIGN_MESSAGE_SUBMITTED, signMessageSagas.signMessage)
  }
}
