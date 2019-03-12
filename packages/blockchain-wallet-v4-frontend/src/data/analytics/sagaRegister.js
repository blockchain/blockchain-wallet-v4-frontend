import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const analyticsSagas = sagas({ api })

  return function * analyticsSaga () {
    yield takeLatest(AT.LOG_EVENT, analyticsSagas.logEvent)
    yield takeLatest(AT.LOG_PAGE_VIEW, analyticsSagas.logPageView)
    yield takeLatest(AT.LOG_GOAL, analyticsSagas.logGoal)
    yield takeLatest(AT.INIT_USER_SESSION, analyticsSagas.initUserSession)
    yield takeLatest(AT.START_SESSION, analyticsSagas.startSession)
    yield takeLatest(AT.STOP_SESSION, analyticsSagas.stopSession)
  }
}
