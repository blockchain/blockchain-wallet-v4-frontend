import * as AT from './actionTypes'
import { takeLatest } from 'redux-saga/effects'
import activitySagas from './sagas'

export default ({ api, networks }) => {
  const sagas = activitySagas({ api, networks })

  return function * coreActivitySaga () {
    yield takeLatest(AT.FETCH_ACTIVITY, sagas.fetchActivity)
  }
}
