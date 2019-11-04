import * as AT from './actionTypes'
import { takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default ({ api, networks }) => {
  const kvStoreLockboxSagas = sagas({ api, networks })

  return function * coreKvStoreLockboxSaga () {
    yield takeLatest(
      AT.FETCH_METADATA_LOCKBOX,
      kvStoreLockboxSagas.fetchMetadataLockbox
    )
  }
}
