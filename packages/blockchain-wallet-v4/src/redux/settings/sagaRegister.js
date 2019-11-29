import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default (...args) => {
  const settingsSagas = sagas(...args)

  return function * coreSettingsSaga () {
    yield takeLatest(AT.FETCH_SETTINGS, settingsSagas.fetchSettings)
  }
}
