import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api, coreSagas, networks }) => {
  const signupSagas = sagas({ api, coreSagas, networks })

  return function* authSaga() {
    yield takeLatest(actions.initializeSignup.type, signupSagas.initializeSignUp)
    yield takeLatest(actions.register.type, signupSagas.register)
    yield takeLatest(actions.resetAccount.type, signupSagas.resetAccount)
    yield takeLatest(actions.restore.type, signupSagas.restore)
    yield takeLatest(actions.restoreFromMetadata.type, signupSagas.restoreFromMetadata)
  }
}
