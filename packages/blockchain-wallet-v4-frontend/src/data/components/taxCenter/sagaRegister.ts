import { takeLatest } from 'redux-saga/effects'

import sagas from './sagas'
import { actions } from './slice'

export default ({ api }) => {
  const taxCenterSagas = sagas({ api })

  return function* taxCenterSaga() {
    yield takeLatest(actions.getReports.type, taxCenterSagas.getReports)
    yield takeLatest(actions.createReport.type, taxCenterSagas.createReport)
  }
}
