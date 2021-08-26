import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actionTypes } from './slice'

export default () => {
  const analyticsSagas = sagas()

  return function* analyticsSaga() {
    yield takeLatest(actionTypes.createABTest, analyticsSagas.createABTest)
    yield takeLatest(actionTypes.logEvent, analyticsSagas.logEvent)
    yield takeLatest(actionTypes.logPageView, analyticsSagas.logPageView)
    yield takeLatest(actionTypes.logGoal, analyticsSagas.logGoal)
    yield takeLatest(actionTypes.initUserSession, analyticsSagas.initUserSession)
    yield takeLatest(actionTypes.startSession, analyticsSagas.startSession)
    yield takeLatest(actionTypes.stopSession, analyticsSagas.stopSession)
  }
}
