import { takeEvery } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default () => {
  const ethSocketSagas = sagas()

  return function*() {
    yield takeEvery(AT.STREAM_MESSAGE, ethSocketSagas.onMessage)
    yield takeEvery(AT.STREAM_ERROR, ethSocketSagas.onError)
  }
}
