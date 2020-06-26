import * as AT from './actionTypes'
import { takeLatest } from 'redux-saga/effects'
import sagas from './sagas'

export default ({ api, networks }) => {
  const kvStoreBtcSagas = sagas({ api, networks })

  return function * coreKvStoreBtcSaga () {
    yield takeLatest(AT.FETCH_METADATA_BTC, kvStoreBtcSagas.fetchMetadataBtc)
  }
}
