import { takeLatest } from 'redux-saga/effects'

import * as AT from './actionTypes'
import sagas from './sagas'

export default ({ api, networks }) => {
  const kvStoreXlmSagas = sagas({ api, networks })

  return function * coreKvStoreXlmSaga() {
    yield takeLatest(AT.FETCH_METADATA_XLM, kvStoreXlmSagas.fetchMetadataXlm)
  }
}
