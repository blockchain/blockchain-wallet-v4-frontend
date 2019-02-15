import { takeLatest } from 'redux-saga/effects'
import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, networks }) => {
  const kvStoreWhatsnewSagas = sagas({ api, networks })

  return function* coreKvStoreWhatsNewSaga () {
    yield takeLatest(
      AT.FETCH_METADATA_WHATSNEW,
      kvStoreWhatsnewSagas.fetchMetadataWhatsnew
    )
  }
}
