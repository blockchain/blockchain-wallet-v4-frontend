import { takeEvery, takeLatest } from 'redux-saga/effects'

import * as actionTypes from '../../actionTypes'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, coreSagas }) => {
  const settingsSagas = sagas({ api, coreSagas })

  return function * settingsSaga() {
    yield takeLatest(
      AT.SETTINGS_NOTIFICATIONS_INITIALIZED,
      settingsSagas.notificationsInitialized
    )
    yield takeEvery(
      actionTypes.form.CHANGE,
      settingsSagas.notificationsFormChanged
    )
    yield takeLatest(
      AT.FETCH_PRODUCTS_ELIGIBILITY,
      settingsSagas.fetchProductsEligibility
    )
  }
}
