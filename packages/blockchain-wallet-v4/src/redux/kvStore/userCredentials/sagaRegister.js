import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, networks }) => {
  const kvStoreUserCredentialsSagas = sagas({ api, networks })

  return function * coreKvStoreUserCredentialsSaga() {
    yield takeLatest(
      AT.FETCH_METADATA_USER_CREDENTIALS,
      kvStoreUserCredentialsSagas.fetchMetadataUserCredentials
    )
  }
}
