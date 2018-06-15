import { takeLatest, takeEvery } from 'redux-saga/effects'
import * as AT from './actionTypes'
import * as actionTypes from '../../actionTypes'
import sagas from './sagas'

export default ({ coreSagas }) => {
  const settingsSaga = sagas({ coreSagas })

  return function * () {
    yield takeLatest(AT.SETTINGS_NOTIFICATIONS_INITIALIZED, settingsSaga.notificationsInitialized)
    yield takeEvery(actionTypes.form.CHANGE, settingsSaga.notificationsFormChanged)
  }
}
