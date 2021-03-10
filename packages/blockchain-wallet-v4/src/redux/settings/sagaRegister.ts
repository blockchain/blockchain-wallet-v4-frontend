import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api }) => {
  const settingsSagas = sagas({ api })

  return function * coreSettingsSaga() {
    yield takeLatest(AT.FETCH_SETTINGS, settingsSagas.fetchSettings)
  }
}
