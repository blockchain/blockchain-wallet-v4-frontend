import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const analyticsSagas = sagas({ api })

  return function* analyticsSaga () {
    yield takeLatest(AT.LOG_EVENT, analyticsSagas.logEvent)
    yield takeLatest(AT.LOG_PAGE_VIEW, analyticsSagas.logPageView)
    yield takeLatest(AT.LOG_SITE_SEARCH, analyticsSagas.logSiteSearch)
    yield takeLatest(AT.RESET_SESSION, analyticsSagas.resetSession)
    yield takeLatest(AT.SET_SESSION, analyticsSagas.setSession)
  }
}
