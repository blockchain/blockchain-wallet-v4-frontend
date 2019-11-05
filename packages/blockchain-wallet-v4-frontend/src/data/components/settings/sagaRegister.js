import * as actionTypes from '../../actionTypes'
import * as AT from './actionTypes'
import { takeEvery, takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default ({ coreSagas }) => {
  const settingsSagas = sagas({ coreSagas })

  return function * settingsSaga () {
    yield takeLatest(
      AT.SETTINGS_NOTIFICATIONS_INITIALIZED,
      settingsSagas.notificationsInitialized
    )
    yield takeEvery(
      actionTypes.form.CHANGE,
      settingsSagas.notificationsFormChanged
    )
  }
}
