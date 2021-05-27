import { takeEvery } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default () => {
  const xlmSocketSagas = sagas()

  return function* xlmSocketSaga() {
    yield takeEvery(AT.STREAM_MESSAGE, xlmSocketSagas.onMessage)
    yield takeEvery(AT.STREAM_ERROR, xlmSocketSagas.onError)
  }
}
