import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api, coreSagas, networks }) => {
  const authSagas = sagas({ api, coreSagas, networks })

  return function* authSaga() {
    yield takeLatest(actions.register.type, authSagas.register)
    yield takeLatest(actions.restore.type, authSagas.restore)
    yield takeLatest(actions.restoreFromMetadata.type, authSagas.restoreFromMetadata)
  }
}
