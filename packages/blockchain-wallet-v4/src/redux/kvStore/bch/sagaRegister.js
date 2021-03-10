import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, networks }) => {
  const kvStoreBchSagas = sagas({ api, networks })

  return function * coreKvStoreBchSaga() {
    yield takeLatest(AT.FETCH_METADATA_BCH, kvStoreBchSagas.fetchMetadataBch)
    yield takeLatest(
      AT.IMPORT_LEGACY_ADDR_BCH,
      kvStoreBchSagas.importLegacyAddress
    )
  }
}
