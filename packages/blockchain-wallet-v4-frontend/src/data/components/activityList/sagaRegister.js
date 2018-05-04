import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ coreSagas }) => {
  const activityListSagas = sagas({ coreSagas })

  return function * () {
    yield takeLatest(AT.ACTIVITY_LIST_INITIALIZED, activityListSagas.initialized)
  }
}
