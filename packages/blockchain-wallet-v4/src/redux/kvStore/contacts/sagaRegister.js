import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, networks }) => {
  const kvStoreContactsSagas = sagas({ api, networks })

  return function* coreKvStoreContactsSaga () {
    yield takeLatest(
      AT.FETCH_METADATA_CONTACTS,
      kvStoreContactsSagas.fetchMetadataContacts
    )
  }
}
