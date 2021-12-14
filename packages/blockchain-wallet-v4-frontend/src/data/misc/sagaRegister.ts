import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default () => {
  const miscSagas = sagas()

  return function* authSaga() {
    yield takeLatest(actions.pingManifestFile.type, miscSagas.pingManifestFile)
  }
}
