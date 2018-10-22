import { takeLatest } from 'redux-saga/effects'
import * as requestAT from './actionTypes'
import sagas from './sagas'

export default ({ networks }) => {
  const requestEthSagas = sagas({ networks })

  return function*() {
    yield takeLatest(
      requestAT.OPEN_LOCKBOX_APP_CLICKED,
      requestEthSagas.openLockboxAppClicked
    )
  }
}
