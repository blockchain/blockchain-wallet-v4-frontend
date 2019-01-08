import { takeLatest, takeEvery } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actionTypes from '../../actionTypes'
import sagas from './sagas'

export default ({ coreSagas }) => {
  const settingsSagas = sagas({ coreSagas })

  return function* settingsSaga () {
    yield takeLatest(
      AT.SETTINGS_NOTIFICATIONS_INITIALIZED,
      settingsSagas.notificationsInitialized
    )
    yield takeLatest(AT.SETTINGS_INITIALIZE_BSV, settingsSagas.initializeBsv)
    yield takeEvery(
      actionTypes.form.CHANGE,
      settingsSagas.notificationsFormChanged
    )
  }
}
