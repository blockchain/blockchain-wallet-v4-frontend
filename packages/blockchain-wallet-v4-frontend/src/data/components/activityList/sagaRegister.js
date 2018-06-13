import { takeEvery } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ coreSagas }) => {
  const activityListSagas = sagas({ coreSagas })

  return function * () {
    yield takeEvery(AT.ACTIVITY_LIST_INITIALIZED, activityListSagas.initialized)
  }
}
