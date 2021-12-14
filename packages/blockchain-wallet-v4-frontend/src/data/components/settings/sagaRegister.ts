import { takeEvery, takeLatest } from 'redux-saga/effects'

import * as actionTypes from '../../actionTypes'
import sagas from './sagas'
import { actions } from './slice'

export default ({ api, coreSagas }) => {
  const settingsSagas = sagas({ api, coreSagas })

  return function* settingsSaga() {
    yield takeLatest(actions.notificationsInitialized.type, settingsSagas.notificationsInitialized)
    yield takeEvery(actionTypes.form.CHANGE, settingsSagas.notificationsFormChanged)
    yield takeLatest(actions.fetchLimitsAndDetails.type, settingsSagas.fetchLimitsAndDetails)
  }
}
