import { takeEvery } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default () => {
  const activityListSagas = sagas()

  return function*() {
    yield takeEvery(AT.ACTIVITY_LIST_INITIALIZED, activityListSagas.initialized)
  }
}
