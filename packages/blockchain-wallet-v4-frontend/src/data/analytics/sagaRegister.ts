import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default () => {
  const analyticsSagas = sagas()

  return function* analyticsSaga() {
    yield takeLatest(actions.createABTest.type, analyticsSagas.createABTest)
    yield takeLatest(actions.logEvent.type, analyticsSagas.logEvent)
    yield takeLatest(actions.logPageView.type, analyticsSagas.logPageView)
    yield takeLatest(actions.logGoal.type, analyticsSagas.logGoal)
    yield takeLatest(actions.initUserSession.type, analyticsSagas.initUserSession)
    yield takeLatest(actions.startSession.type, analyticsSagas.startSession)
    yield takeLatest(actions.stopSession.type, analyticsSagas.stopSession)
  }
}
