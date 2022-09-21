import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default () => {
  const miscSagas = sagas()

  return function* authSaga() {
    yield takeLatest(actions.generateCaptchaToken.type, miscSagas.generateCaptchaToken)
    yield takeLatest(actions.pingRuntimeFile.type, miscSagas.pingRuntimeFile)
  }
}
