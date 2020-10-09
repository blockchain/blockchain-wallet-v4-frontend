import * as AT from './actionTypes'
import { takeLatest } from 'redux-saga/effects'
import activitySagas from './sagas'

export default ({ api, networks, options }) => {
  const sagas = activitySagas({ api, networks, options })

  return function * coreActivitySaga () {
    yield takeLatest(AT.FETCH_ACTIVITY, sagas.fetchActivity)
  }
}
