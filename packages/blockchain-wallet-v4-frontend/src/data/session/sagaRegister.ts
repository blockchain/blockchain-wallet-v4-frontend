import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { deauthorizeBrowser, logout, logoutClearReduxStore } from './slice'

export default ({ api }) => {
  const sessionSagas = sagas({ api })

  return function* sessionSaga() {
    yield takeLatest(deauthorizeBrowser.type, sessionSagas.deauthorizeBrowser)
    yield takeLatest(logout.type, sessionSagas.logout)
    yield takeLatest(logoutClearReduxStore.type, sessionSagas.logoutClearReduxStore)
  }
}
