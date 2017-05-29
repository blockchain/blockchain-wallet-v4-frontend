import * as types from './actionTypes'
import {takeLatest} from 'redux-saga'
import activitySagas from './Activity/sagas.js'

function* sagas () {
  yield takeLatest(types.FETCH_ACTIVITIES, activitySagas.fetchActivities)
}

export default sagas
