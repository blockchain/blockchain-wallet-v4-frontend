import * as AT from './actionTypes'
import { takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default ({ coreSagas }) => {
  const signMessageSagas = sagas({ coreSagas })
  return function * signMessageSaga () {
    yield takeLatest(
      AT.BCH_SIGN_MESSAGE_SUBMITTED,
      signMessageSagas.signMessage
    )
  }
}
