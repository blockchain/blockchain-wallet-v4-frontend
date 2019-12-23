import * as AT from './actionTypes'
import { takeEvery } from 'redux-saga/effects'
import sagas from './sagas'

export default () => {
  const activityListSagas = sagas()

  return function * activityListSaga () {
    yield takeEvery(AT.ACTIVITY_LIST_INITIALIZED, activityListSagas.initialized)
  }
}
