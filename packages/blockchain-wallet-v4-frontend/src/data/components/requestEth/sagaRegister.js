import * as requestAT from './actionTypes'
import { takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default ({ networks }) => {
  const requestEthSagas = sagas({ networks })

  return function * requestEthSaga () {
    yield takeLatest(
      requestAT.OPEN_LOCKBOX_APP_CLICKED,
      requestEthSagas.openLockboxAppClicked
    )
  }
}
